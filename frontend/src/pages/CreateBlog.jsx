import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { homeApiUrl } from "../utils/api";

export default function CreateBlog({ theme, toggleTheme }) {
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        image: "", // Cover image
        category: "Technology"
    });

    // We use a ref for the content editor to avoid cursor jumping issues with React state
    const editorRef = useRef(null);
    const coverImageRef = useRef(null);
    const inlineImageRef = useRef(null);
    const [recognizing, setRecognizing] = useState(false);
    const recognitionRef = useRef(null);

    const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
    const [currentStyle, setCurrentStyle] = useState("Normal");

    const categories = ["Technology", "Business", "Food", "Travel", "Lifestyle", "Health", "Fashion"];
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    useEffect(() => {
        // Init Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = true;
            recog.interimResults = false;
            recog.lang = "en-US";
            recog.onresult = (event) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript && editorRef.current) {
                    document.execCommand('insertText', false, finalTranscript + " ");
                }
            };
            recog.onend = () => setRecognizing(false);
            recognitionRef.current = recog;
        }

        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.abort(); } catch (e) { }
            }
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login.");
            navigate("/login");
            return;
        }

        if (isEditing) {
            fetch(homeApiUrl(`/posts/${id}`))
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        title: data.title,
                        subtitle: data.excerpt,
                        image: data.image,
                        category: data.category || "Technology"
                    });
                    if (editorRef.current) {
                        editorRef.current.innerHTML = data.content;
                    }
                })
                .catch(err => console.error(err));
        } else {
            // Load draft
            try {
                const draft = localStorage.getItem('createBlogDraft');
                if (draft) {
                    const parsed = JSON.parse(draft);
                    setFormData(prev => ({ ...prev, ...parsed }));
                    if (parsed.content && editorRef.current) {
                        editorRef.current.innerHTML = parsed.content;
                    }
                }
            } catch (e) { }
        }
    }, [navigate, id, isEditing]);

    const wrapEditorImage = (img) => {
        if (!img || img.closest('.editor-image-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'editor-image-wrapper';
        wrapper.contentEditable = 'false';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'block';
        wrapper.style.marginBottom = '20px';

        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.width = '100%';
        img.style.objectFit = 'contain';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'editor-image-delete';
        deleteBtn.innerHTML = '🗑';

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);
    };

    const normalizeEditorImages = () => {
        if (!editorRef.current) return;

        const existingImgs = Array.from(editorRef.current.querySelectorAll('img'));
        existingImgs.forEach(img => {
            wrapEditorImage(img);
        });
    };

    const removeImageWrapper = (wrapper) => {
        if (!wrapper) return;
        wrapper.remove();
        saveDraft();
    };

    const saveDraft = () => {
        if (isEditing) return;
        normalizeEditorImages();
        const content = editorRef.current ? editorRef.current.innerHTML : "";
        const toSave = { ...formData, content };
        localStorage.setItem('createBlogDraft', JSON.stringify(toSave));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userStr = localStorage.getItem("user");
        let extraData = {};

        if (userStr) {
            const user = JSON.parse(userStr);
            extraData = {
                authorName: user.name,
                authorEmail: user.email,
                authorAvatar: user.avatar,
                authorId: user._id
            };
        }

        const content = editorRef.current ? editorRef.current.innerHTML : "";
        const url = isEditing
            ? homeApiUrl(`/posts/${id}`)
            : homeApiUrl("/posts");
        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, content, ...extraData })
        })
            .then(res => {
                if (res.ok) {
                    try { localStorage.removeItem('createBlogDraft'); } catch (e) { }
                    if (isEditing) {
                        navigate("/profile");
                    } else {
                        const user = userStr ? JSON.parse(userStr) : {};
                        if (user.isAdmin) {
                            navigate("/profile");
                        } else {
                            alert("Your blog has been submitted for review. You'll be notified when it's approved.");
                            navigate("/profile");
                        }
                    }
                } else {
                    res.json().then(data => alert(data.message || "Failed to save post")).catch(() => alert("Failed to save post"));
                }
            })
            .catch(err => console.error(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        saveDraft(); // Simple save trigger
    };

    const handleToolbar = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current.focus();

        // Ensure style label stays accurate after change
        updateCurrentTextStyle();
    };

    const updateCurrentTextStyle = () => {
        if (!editorRef.current) return;
        let block = document.queryCommandValue("formatBlock");
        if (!block) {
            setCurrentStyle("Normal");
            return;
        }

        block = block.toString().toUpperCase();
        if (block.startsWith("H1")) setCurrentStyle("H1");
        else if (block.startsWith("H2")) setCurrentStyle("H2");
        else if (block.startsWith("H3")) setCurrentStyle("H3");
        else setCurrentStyle("Normal");
    };

    const applyTextStyle = (styleKey) => {
        if (styleKey === "Normal") {
            handleToolbar("formatBlock", "P");
        } else {
            handleToolbar("formatBlock", styleKey);
        }
        setCurrentStyle(styleKey);
        setIsStyleDropdownOpen(false);
    };

    useEffect(() => {
        const onSelectionChange = () => {
            const active = document.activeElement === editorRef.current;
            if (active) updateCurrentTextStyle();
        };

        const onEditorClick = (e) => {
            const deleteBtn = e.target.closest('.editor-image-delete');
            if (deleteBtn) {
                e.preventDefault();
                const wrapper = deleteBtn.closest('.editor-image-wrapper');
                if (wrapper) removeImageWrapper(wrapper);
            }
            // if click inside editor, update the style label
            if (editorRef.current && editorRef.current.contains(e.target)) {
                updateCurrentTextStyle();
            }
        };

        const editor = editorRef.current;
        document.addEventListener("selectionchange", onSelectionChange);
        document.addEventListener("click", onEditorClick);
        editor?.addEventListener("focus", updateCurrentTextStyle);

        // Normalize existing image nodes on mount
        normalizeEditorImages();

        return () => {
            document.removeEventListener("selectionchange", onSelectionChange);
            document.removeEventListener("click", onEditorClick);
            editor?.removeEventListener("focus", updateCurrentTextStyle);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onClickOutside = (event) => {
            if (!editorRef.current) return;
            const toolbarWrapper = event.target.closest("[data-toolbar-style]");
            if (!toolbarWrapper) setIsStyleDropdownOpen(false);
        };

        document.addEventListener("click", onClickOutside);
        return () => document.removeEventListener("click", onClickOutside);
    }, []);

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
                saveDraft();
            };
            reader.readAsDataURL(file);
        }
    };

    const insertImageAtCursor = (src) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection) return;

        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (!range) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'editor-image-wrapper';
        wrapper.contentEditable = 'false';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'block';
        wrapper.style.marginBottom = '20px';

        const img = document.createElement('img');
        img.src = src;
        img.className = 'editor-image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.width = '100%';
        img.style.objectFit = 'contain';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'editor-image-delete';
        deleteBtn.innerHTML = '🗑';

        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);

        range.deleteContents();
        range.insertNode(wrapper);

        const newRange = document.createRange();
        newRange.setStartAfter(wrapper);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        editorRef.current.focus();
        saveDraft();
    };

    const handleInlineImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                insertImageAtCursor(reader.result);
            };
            reader.readAsDataURL(file);
        }
        // Reset the input so the same file can be uploaded again if needed
        e.target.value = null;
    };

    const triggerInlineImageUpload = () => {
        if (inlineImageRef.current) {
            inlineImageRef.current.click();
        }
    };

    const startStopRecognition = () => {
        if (!recognitionRef.current) {
            alert('Speech Recognition not supported');
            return;
        }
        if (recognizing) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setRecognizing(true);
        }
    };

    const inputStyle = {
        padding: "16px",
        borderRadius: "12px",
        border: "var(--border-glass)",
        background: "var(--bg-glass)",
        color: "var(--text-main)",
        outline: "none",
        width: "100%",
        fontSize: "1rem"
    };

    const toolbarBtnStyle = {
        background: "var(--bg-glass)", border: "var(--border-glass)", color: "var(--text-main)",
        padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600"
    };

    return (
        <>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div className="container" style={{ paddingTop: "120px", paddingBottom: "60px", maxWidth: "900px" }}>
                <h2 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "40px", textAlign: "center" }}>
                    {isEditing ? "Edit Your Story" : "Start Writing"}
                </h2>

                <form onSubmit={handleSubmit} className="glass" style={{ padding: "40px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Title</label>
                        <input name="title" required placeholder="Enter an engaging title..." value={formData.title} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Subtitle</label>
                        <input name="subtitle" required placeholder="A short description..." value={formData.subtitle} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} style={{ color: "black" }}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Cover image</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <input type="file" ref={coverImageRef} accept="image/*" onChange={handleCoverImageChange} style={{ display: "none" }} />
                                <button type="button" onClick={() => coverImageRef.current && coverImageRef.current.click()} style={{ ...toolbarBtnStyle, flex: 1, padding: "16px", background: "rgba(99, 102, 241, 0.1)", color: "#818cf8", border: "1px dashed var(--border-glass)" }}>
                                    {formData.image ? "Change Cover Image" : "Upload Cover Image from Device"}
                                </button>
                                {formData.image && (
                                    <img src={formData.image} alt="Cover Preview" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontWeight: "600" }}>
                            <span>Content</span>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <button type="button" onClick={startStopRecognition} style={{ ...toolbarBtnStyle, background: recognizing ? "rgba(34,197,94,0.2)" : toolbarBtnStyle.background, color: recognizing ? "#22c55e" : "white" }}>
                                    {recognizing ? '● Rec' : '🎤 Speak'}
                                </button>
                            </div>
                        </label>

                        {/* Toolbar */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                            <button type="button" onClick={() => handleToolbar('bold')} style={toolbarBtnStyle}><b>B</b></button>
                            <button type="button" onClick={() => handleToolbar('italic')} style={toolbarBtnStyle}><i>I</i></button>
                            <button type="button" onClick={() => handleToolbar('underline')} style={toolbarBtnStyle}><u>U</u></button>
                            <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.2)", margin: "0 8px" }}></div>

                            <div data-toolbar-style style={{ position: "relative", width: "120px" }}>
                                <button
                                    type="button"
                                    onClick={() => setIsStyleDropdownOpen(prev => !prev)}
                                    style={{
                                        ...toolbarBtnStyle,
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "rgba(15, 23, 42, 0.8)",
                                        color: "white",
                                        border: "1px solid rgba(148, 163, 184, 0.4)",
                                        minHeight: "36px"
                                    }}
                                >
                                    {currentStyle}
                                    <span style={{ marginLeft: "8px", fontSize: "0.75rem" }}>▾</span>
                                </button>
                                {isStyleDropdownOpen && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 4px)",
                                            left: 0,
                                            width: "100%",
                                            background: "rgba(15, 23, 42, 0.95)",
                                            border: "1px solid rgba(148, 163, 184, 0.4)",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                                            zIndex: 20,
                                            overflow: "hidden"
                                        }}
                                    >
                                        {['H1', 'H2', 'H3', 'Normal'].map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => applyTextStyle(item)}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px 10px",
                                                    border: "none",
                                                    background: item === currentStyle ? "rgba(99, 102, 241, 0.4)" : "transparent",
                                                    color: "white",
                                                    textAlign: "left",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {item === 'Normal' ? 'Paragraph' : item}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button type="button" onClick={() => handleToolbar('insertUnorderedList')} style={toolbarBtnStyle}>• List</button>
                            <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.2)", margin: "0 8px" }}></div>
                            <input type="file" ref={inlineImageRef} accept="image/*" onChange={handleInlineImageChange} style={{ display: "none" }} />
                            <button type="button" onClick={triggerInlineImageUpload} style={{ ...toolbarBtnStyle, background: "rgba(99, 102, 241, 0.2)", color: "#818cf8" }}>📷 Insert Image</button>
                        </div>

                        {/* Rich Text Editor */}
                        <div
                            ref={editorRef}
                            contentEditable
                            className="editor-content"
                            onInput={() => { normalizeEditorImages(); saveDraft(); }}
                            style={{
                                ...inputStyle,
                                minHeight: "400px",
                                fontFamily: "inherit",
                                lineHeight: "1.6",
                                overflowY: "auto"
                            }}
                        />
                        <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            Highlight text to format. Click 'Insert Image' to add images between text.
                        </p>
                    </div>

                    <button type="submit" className="btn-primary" style={{ fontSize: "1.1rem", padding: "16px" }}>Publish Story</button>

                </form>
            </div>
            <Footer />
        </>
    );
}
