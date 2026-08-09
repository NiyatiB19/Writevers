import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { homeApiUrl } from "../utils/api";

const API_BASE = homeApiUrl();

const adminNav = [
  { id: "all-blogs", label: "All Blogs", icon: "📝" },
  { id: "contact", label: "Contact Messages", icon: "✉️" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "reported", label: "Reported Posts", icon: "⚠️" },
];

const getAdminHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  try {
    const user = JSON.parse(userStr);
    return { "Content-Type": "application/json", "x-user-id": user._id };
  } catch {
    return {};
  }
};

export default function Admin({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState("all-blogs");
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter state
  const [allPosts, setAllPosts] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({ posts: true, contact: true, reported: true, users: true });
  const [error, setError] = useState(null); // Global error state for dashboard

  // Modals
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editBlogModal, setEditBlogModal] = useState(null); // Full blog details
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");

  const navigate = useNavigate();

  const fetchPosts = () => {
    setLoading(l => ({ ...l, posts: true }));
    setError(null);
    const query = statusFilter !== "all" ? `?status=${statusFilter}` : "";
    fetch(`${API_BASE}/admin/posts${query}`, { headers: getAdminHeaders() })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch posts");
        }
        return res.json();
      })
      .then(data => { setAllPosts(Array.isArray(data) ? data : []); setLoading(l => ({ ...l, posts: false })); })
      .catch(err => {
        console.error("Fetch posts error:", err);
        setError(err.message);
        setLoading(l => ({ ...l, posts: false }));
      });
  };

  const fetchContact = () => {
    setLoading(l => ({ ...l, contact: true }));
    setError(null);
    fetch(`${API_BASE}/admin/contact-messages`, { headers: getAdminHeaders() })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch messages");
        }
        return res.json();
      })
      .then(data => { setContactMessages(Array.isArray(data) ? data : []); setLoading(l => ({ ...l, contact: false })); })
      .catch(err => {
        console.error("Fetch contact error:", err);
        setError(err.message);
        setLoading(l => ({ ...l, contact: false }));
      });
  };

  const fetchReported = () => {
    setLoading(l => ({ ...l, reported: true }));
    setError(null);
    fetch(`${API_BASE}/admin/reported`, { headers: getAdminHeaders() })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch reported posts");
        }
        return res.json();
      })
      .then(data => { setReportedPosts(Array.isArray(data) ? data : []); setLoading(l => ({ ...l, reported: false })); })
      .catch(err => {
        console.error("Fetch reported error:", err);
        setError(err.message);
        setLoading(l => ({ ...l, reported: false }));
      });
  };

  const fetchUsers = () => {
    setLoading(l => ({ ...l, users: true }));
    setError(null);
    fetch(`${API_BASE}/admin/users`, { headers: getAdminHeaders() })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch users");
        }
        return res.json();
      })
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(l => ({ ...l, users: false })); })
      .catch(err => {
        console.error("Fetch users error:", err);
        setError(err.message);
        setLoading(l => ({ ...l, users: false }));
      });
  };

  useEffect(() => {
    if (activeTab === "all-blogs") fetchPosts();
    if (activeTab === "contact") fetchContact();
    if (activeTab === "reported") fetchReported();
    if (activeTab === "users") fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, statusFilter]);

  const handleUpdateStatus = (postId, status) => {
    fetch(`${API_BASE}/admin/posts/${postId}/approve`, {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify({ status })
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        setEditBlogModal(null);
        fetchPosts();
        alert(`Post marked as ${status}`);
      })
      .catch(() => alert("Failed to update status."));
  };

  const handleRejectSubmit = () => {
    if (!rejectModal) return;
    fetch(`${API_BASE}/admin/posts/${rejectModal}/reject`, {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify({ reason: rejectReason || "No reason provided." })
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => { setRejectModal(null); setEditBlogModal(null); setRejectReason(""); fetchPosts(); })
      .catch(() => alert("Failed to reject."));
  };

  const handleDeletePost = (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    fetch(`${API_BASE}/posts/${id}`, { method: "DELETE", headers: getAdminHeaders() })
      .then(res => {
        if (res.ok) fetchPosts();
        else alert("Failed to delete");
      })
      .catch(() => alert("Failed to delete"));
  };

  const handleReplySubmit = () => {
    if (!replyModal) return;
    fetch(`${API_BASE}/admin/contact-messages/${replyModal}/reply`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify({ reply: replyText })
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => { setReplyModal(null); setReplyText(""); fetchContact(); })
      .catch(() => alert("Failed to send reply."));
  };

  const handleDeleteContact = (id) => {
    if (!window.confirm("Delete this message?")) return;
    fetch(`${API_BASE}/admin/contact-messages/${id}`, { method: "DELETE", headers: getAdminHeaders() })
      .then(res => {
        if (res.ok) fetchContact();
        else alert("Failed to delete");
      })
      .catch(() => alert("Failed to delete"));
  };

  const handleDeleteReported = (id) => {
    if (!window.confirm("Delete this reported post?")) return;
    fetch(`${API_BASE}/admin/posts/${id}`, { method: "DELETE", headers: getAdminHeaders() })
      .then(res => {
        if (res.ok) { setReportedPosts(prev => prev.filter(p => p._id !== id)); }
        else alert("Failed to delete.");
      })
      .catch(() => alert("Failed to delete."));
  };

  const sidebarStyle = {
    width: "260px",
    minHeight: "calc(100vh - 180px)",
    background: "var(--bg-card)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const tableHeaderStyle = {
    padding: "16px",
    textAlign: "left",
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  };

  const tableCellStyle = {
    padding: "16px",
    color: "var(--text-main)",
    borderBottom: "1px solid var(--border-glass)",
    fontSize: "0.95rem"
  };

  const getStatusBadge = (status) => {
    // Since we are using inline styles mostly, we'll map to inline styles roughly
    let style = { padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", textTransform: "capitalize" };
    if (status === 'published') style = { ...style, background: "rgba(34, 197, 94, 0.2)", color: "#4ade80" };
    else if (status === 'pending') style = { ...style, background: "rgba(234, 179, 8, 0.2)", color: "#facc15" };
    else if (status === 'rejected') style = { ...style, background: "rgba(239, 68, 68, 0.2)", color: "#f87171" };
    else if (status === 'onhold') style = { ...style, background: "rgba(249, 115, 22, 0.2)", color: "#fb923c" };

    return <span style={style}>{status || 'Published'}</span>;
  };

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container" style={{ paddingTop: "100px", paddingBottom: "60px", minHeight: "80vh" }}>
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          {/* Sidebar */}
          <aside style={sidebarStyle}>
            <h2 className="text-gradient" style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Admin</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>Moderate content</p>
            {adminNav.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: activeTab === t.id ? "rgba(99, 102, 241, 0.2)" : "transparent",
                  color: activeTab === t.id ? "#818cf8" : "var(--text-muted)",
                  cursor: "pointer",
                  fontWeight: activeTab === t.id ? "600" : "500",
                  textAlign: "left",
                  fontSize: "1rem",
                }}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
            <Link
              to="/"
              style={{
                marginTop: "auto",
                padding: "10px 16px",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              ← Back to site
            </Link>
          </aside>

          {/* Content */}
          <main style={{ flex: 1, minWidth: 0, background: "var(--bg-card)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", overflowX: "auto" }}>

            {error && (
              <div style={{
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                color: "#f87171",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* All Blogs Tab */}
            {activeTab === "all-blogs" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ color: "var(--text-main)", fontSize: "1.5rem", margin: 0 }}>All Blogs</h3>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.1)",
                      color: "var(--text-main)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="all" style={{ color: "black" }}>All Status</option>
                    <option value="published" style={{ color: "black" }}>Published</option>
                    <option value="pending" style={{ color: "black" }}>Pending</option>
                    <option value="onhold" style={{ color: "black" }}>On Hold</option>
                    <option value="rejected" style={{ color: "black" }}>Rejected</option>
                  </select>
                </div>
                {loading.posts ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Status</th>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Blog Title</th>
                        <th style={tableHeaderStyle}>User Name</th>
                        <th style={tableHeaderStyle}>Created Date</th>
                        <th style={tableHeaderStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPosts.map(post => (
                        <tr key={post._id}>
                          <td style={tableCellStyle}>{getStatusBadge(post.status)}</td>
                          <td style={tableCellStyle}><small style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>{post._id.slice(-6)}</small></td>
                          <td style={tableCellStyle} title={post.title}>{post.title.slice(0, 30)}{post.title.length > 30 ? '...' : ''}</td>
                          <td style={tableCellStyle}>{post.author}</td>
                          <td style={tableCellStyle}>{new Date(post.createdAt).toLocaleDateString()}</td>
                          <td style={tableCellStyle}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => setEditBlogModal(post)} style={{ background: "rgba(99, 102, 241, 0.2)", border: "none", color: "#818cf8", borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontWeight: "600" }}>Edit</button>
                              <button onClick={() => handleDeletePost(post._id)} style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#f87171", borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontWeight: "600" }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* Contact Messages Tab */}
            {activeTab === "contact" && (
              <>
                <h3 style={{ color: "var(--text-main)", marginBottom: "24px", fontSize: "1.5rem" }}>Contact Messages</h3>
                {loading.contact ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Subject</th>
                        <th style={tableHeaderStyle}>Message</th>
                        <th style={tableHeaderStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.map(msg => (
                        <tr key={msg._id}>
                          <td style={tableCellStyle}>{msg.name}</td>
                          <td style={tableCellStyle}>{msg.email}</td>
                          <td style={tableCellStyle}>{msg.subject}</td>
                          <td style={tableCellStyle}>
                            <div style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.message}</div>
                          </td>
                          <td style={tableCellStyle}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => { setReplyModal(msg._id); setReplyText(msg.adminReply || ""); }} style={{ background: "rgba(99, 102, 241, 0.2)", border: "none", color: "#818cf8", borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontWeight: "600" }}>
                                {msg.adminReply ? "View/Edit Reply" : "Reply"}
                              </button>
                              <button onClick={() => handleDeleteContact(msg._id)} style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#f87171", borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontWeight: "600" }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <>
                <h3 style={{ color: "var(--text-main)", marginBottom: "24px", fontSize: "1.5rem" }}>Users</h3>
                {loading.users ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Role</th>
                        <th style={tableHeaderStyle}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td style={tableCellStyle}><small style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>{user._id.slice(-6)}</small></td>
                          <td style={tableCellStyle}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <img src={user.avatar || "https://i.pravatar.cc/150"} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                              {user.name}
                            </div>
                          </td>
                          <td style={tableCellStyle}>{user.email}</td>
                          <td style={tableCellStyle}>{user.isAdmin ? <span style={{ color: "#818cf8" }}>Admin</span> : "User"}</td>
                          <td style={tableCellStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* Reported Posts Tab */}
            {activeTab === "reported" && (
              <>
                <h3 style={{ color: "var(--text-main)", marginBottom: "24px", fontSize: "1.5rem" }}>Reported Posts</h3>
                {loading.reported ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Title</th>
                        <th style={tableHeaderStyle}>Reports</th>
                        <th style={tableHeaderStyle}>Reasons</th>
                        <th style={tableHeaderStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportedPosts.map(post => (
                        <tr key={post._id}>
                          <td style={tableCellStyle}>{post.title}</td>
                          <td style={tableCellStyle}>{post.reports?.length || 0}</td>
                          <td style={tableCellStyle}>
                            {post.reports?.slice(0, 2).map((r, i) => <div key={i}><small>{r.reason}</small></div>)}
                            {post.reports?.length > 2 && <small>+{post.reports.length - 2} more</small>}
                          </td>
                          <td style={tableCellStyle}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => navigate(`/read/${post._id}`)} style={{ background: "rgba(99, 102, 241, 0.2)", border: "none", color: "#818cf8", borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontWeight: "600" }}>View</button>
                              <button onClick={() => handleDeleteReported(post._id)} style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#f87171", borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontWeight: "600" }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

          </main>
        </div>
      </div>

      {/* Edit Blog Details Modal */}
      {editBlogModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: "blur(4px)" }} onClick={() => setEditBlogModal(null)}>
          <div className="glass" style={{ width: "90%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", borderRadius: "20px", padding: "32px", border: "var(--border-glass)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ color: "var(--text-main)", margin: 0 }}>Edit Blog Status</h2>
              <button onClick={() => setEditBlogModal(null)} style={{ background: "transparent", border: "none", color: "var(--text-main)", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>ID</label>
                <div style={{ color: "var(--text-main)", padding: "8px 0", borderBottom: "var(--border-glass)" }}>{editBlogModal._id}</div>
              </div>
              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Created Date</label>
                <div style={{ color: "var(--text-main)", padding: "8px 0", borderBottom: "var(--border-glass)" }}>{new Date(editBlogModal.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Title</label>
                <div style={{ color: "var(--text-main)", fontSize: "1.1rem", fontWeight: "600", padding: "8px 0", borderBottom: "var(--border-glass)" }}>{editBlogModal.title}</div>
              </div>
              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>User Name</label>
                <div style={{ color: "var(--text-main)", padding: "8px 0", borderBottom: "var(--border-glass)" }}>{editBlogModal.author}</div>
              </div>
              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Category</label>
                <div style={{ color: "var(--text-main)", padding: "8px 0", borderBottom: "var(--border-glass)" }}>{editBlogModal.category}</div>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Cover Image</label>
                {editBlogModal.image && <img src={editBlogModal.image} alt="Cover" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "12px", marginTop: "8px" }} />}
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Excerpt</label>
                <div style={{ color: "var(--text-muted)", padding: "8px 0", fontStyle: "italic" }}>{editBlogModal.excerpt}</div>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Content Preview</label>
                <div style={{ color: "var(--text-main)", padding: "12px", background: "var(--bg-glass)", borderRadius: "8px", marginTop: "4px", maxHeight: "200px", overflowY: "auto", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: editBlogModal.content }}></div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => handleUpdateStatus(editBlogModal._id, "onhold")} style={{ padding: "10px 20px", borderRadius: "20px", background: "rgba(249, 115, 22, 0.2)", color: "#fb923c", border: "1px solid rgba(249, 115, 22, 0.4)", cursor: "pointer" }}>On Hold</button>
              <button onClick={() => { setRejectModal(editBlogModal._id); }} style={{ padding: "10px 20px", borderRadius: "20px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)", cursor: "pointer" }}>Reject</button>
              <button onClick={() => handleUpdateStatus(editBlogModal._id, "published")} className="btn-primary" style={{ padding: "10px 24px" }}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200,
        }} onClick={() => setRejectModal(null)}>
          <div className="glass" style={{ padding: "32px", borderRadius: "20px", maxWidth: "440px", width: "90%", border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>
            <h4 style={{ margin: "0 0 16px 0", color: "var(--text-main)" }}>Reject post</h4>
            <p style={{ color: "var(--text-muted)", marginBottom: "16px", fontSize: "0.9rem" }}>Reason for rejection (Compulsory):</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Content violates guidelines..."
              style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "12px", border: "var(--border-glass)", background: "var(--bg-glass)", color: "var(--text-main)", outline: "none", marginBottom: "20px", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setRejectModal(null)} style={{ padding: "10px 20px", borderRadius: "20px", border: "var(--border-glass)", background: "transparent", color: "var(--text-main)", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRejectSubmit} disabled={!rejectReason.trim()} style={{ padding: "10px 20px", borderRadius: "20px", border: "none", background: !rejectReason.trim() ? "gray" : "rgba(239, 68, 68, 0.8)", color: "var(--text-main)", cursor: "pointer", fontWeight: "600" }}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }} onClick={() => setReplyModal(null)}>
          <div className="glass" style={{ padding: "32px", borderRadius: "20px", maxWidth: "500px", width: "90%", border: "var(--border-glass)" }} onClick={e => e.stopPropagation()}>
            <h4 style={{ margin: "0 0 16px 0", color: "var(--text-main)" }}>Reply to Message</h4>

            {/* Show message context */}
            {contactMessages.find(m => m._id === replyModal) && (
              <div style={{ marginBottom: "16px", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Subject: {contactMessages.find(m => m._id === replyModal).subject}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{contactMessages.find(m => m._id === replyModal).message}</div>
              </div>
            )}

            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write your reply here..."
              style={{ width: "100%", minHeight: "150px", padding: "12px", borderRadius: "12px", border: "var(--border-glass)", background: "var(--bg-glass)", color: "var(--text-main)", outline: "none", marginBottom: "20px", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setReplyModal(null)} style={{ padding: "10px 20px", borderRadius: "20px", border: "var(--border-glass)", background: "transparent", color: "var(--text-main)", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleReplySubmit} className="btn-primary" style={{ padding: "10px 20px" }}>Send Reply & Notify</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
