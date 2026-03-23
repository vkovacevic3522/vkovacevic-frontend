import { useState } from "react";
import "./ActuaryManagementPage.css";

//mock podaci bez apija
const MOCK_AGENTS = [
    { id: 1, firstName: "Marko", lastName: "Markovic", email: "marko.m@banka.rs", position: "Senior Agent", limit: 500000, usedLimit: 123400 },
    { id: 2, firstName: "Ana", lastName: "Petrovic", email: "ana.p@banka.rs", position: "Junior Agent", limit: 100000, usedLimit: 87000 },
    { id: 3, firstName: "Nikola", lastName: "Ilic", email: "nikola.i@banka.rs", position: "Agent", limit: 250000, usedLimit: 0 },
    { id: 4, firstName: "Jovana", lastName: "Jovanovic", email: "jovana.j@banka.rs", position: "Senior Agent", limit: 750000, usedLimit: 310000 },
    { id: 5, firstName: "Stefan", lastName: "Stefanovic", email: "stefan.s@banka.rs", position: "Junior Agent", limit: 100000, usedLimit: 99500 },
];

function formatCurrency(val) {
    return new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(val);
}

function LimitBar({ used, total }) {
    const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
    const color = pct > 90 ? "#f87171" : pct > 60 ? "#fbbf24" : "#34d399";
    return (
        <div className="amp-bar-track">
            <div className="amp-bar-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
    );
}

export default function ActuaryManagementPage() {
    const [agents, setAgents] = useState(MOCK_AGENTS);
    const [filters, setFilters] = useState({ name: "", email: "", position: "" });
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [confirmReset, setConfirmReset] = useState(null);

    const filtered = agents.filter((a) => {
        const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
        return (
            fullName.includes(filters.name.toLowerCase()) &&
            a.email.toLowerCase().includes(filters.email.toLowerCase()) &&
            a.position.toLowerCase().includes(filters.position.toLowerCase())
        );
    });

    const handleLimitSave = (id) => {
        const val = parseFloat(editValue);
        if (isNaN(val) || val < 0) return;
        setAgents(agents.map((a) => (a.id === id ? { ...a, limit: val } : a)));
        setEditingId(null);
        setEditValue("");
    };

    const handleResetUsed = (id) => {
        setAgents(agents.map((a) => (a.id === id ? { ...a, usedLimit: 0 } : a)));
        setConfirmReset(null);
    };

    return (
        <div className="amp-page">
            {/* Header */}
            <div className="amp-header">
                <div>
                    <h1 className="amp-title">Upravljanje agentima</h1>
                    <p className="amp-subtitle">Pregled i upravljanje limitima agenata</p>
                </div>
                <div className="amp-badge">Supervisor</div>
            </div>

            {/* Filters */}
            <div className="amp-filters">
                <div className="amp-filter-field">
                    <label className="amp-filter-label">Ime i prezime</label>
                    <input
                        className="amp-filter-input"
                        type="text"
                        placeholder="Pretraži po imenu..."
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />
                </div>
                <div className="amp-filter-field">
                    <label className="amp-filter-label">Email</label>
                    <input
                        className="amp-filter-input"
                        type="text"
                        placeholder="Pretraži po emailu..."
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    />
                </div>
                <div className="amp-filter-field">
                    <label className="amp-filter-label">Pozicija</label>
                    <input
                        className="amp-filter-input"
                        type="text"
                        placeholder="Pretraži po poziciji..."
                        value={filters.position}
                        onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="amp-table-wrap">
                <table className="amp-table">
                    <thead>
                    <tr>
                        <th>Ime i prezime</th>
                        <th>Email</th>
                        <th>Pozicija</th>
                        <th>Limit</th>
                        <th>Iskorišćeno</th>
                        <th>Iskorišćenost</th>
                        <th>Akcije</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="amp-empty">Nema pronađenih agenata.</td>
                        </tr>
                    ) : (
                        filtered.map((agent) => (
                            <tr key={agent.id}>
                                <td className="amp-td-name">
                                    <div className="amp-avatar">{agent.firstName[0]}{agent.lastName[0]}</div>
                                    <span>{agent.firstName} {agent.lastName}</span>
                                </td>
                                <td className="amp-td-muted">{agent.email}</td>
                                <td>
                                    <span className="amp-position-badge">{agent.position}</span>
                                </td>
                                <td>
                                    {editingId === agent.id ? (
                                        <div className="amp-edit-row">
                                            <input
                                                className="amp-edit-input"
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                autoFocus
                                            />
                                            <button className="amp-btn-save" onClick={() => handleLimitSave(agent.id)}>✓</button>
                                            <button className="amp-btn-cancel" onClick={() => setEditingId(null)}>✕</button>
                                        </div>
                                    ) : (
                                        <span className="amp-limit-val">{formatCurrency(agent.limit)}</span>
                                    )}
                                </td>
                                <td>
                    <span className={`amp-used-val ${agent.usedLimit / agent.limit > 0.9 ? "amp-used-val--danger" : ""}`}>
                      {formatCurrency(agent.usedLimit)}
                    </span>
                                </td>
                                <td className="amp-td-bar">
                                    <LimitBar used={agent.usedLimit} total={agent.limit} />
                                    <span className="amp-bar-pct">
                      {agent.limit > 0 ? Math.round((agent.usedLimit / agent.limit) * 100) : 0}%
                    </span>
                                </td>
                                <td>
                                    <div className="amp-actions">
                                        <button
                                            className="amp-btn-edit"
                                            onClick={() => { setEditingId(agent.id); setEditValue(agent.limit); }}
                                            title="Promeni limit"
                                        >
                                            Limit
                                        </button>
                                        <button
                                            className="amp-btn-reset"
                                            onClick={() => setConfirmReset(agent.id)}
                                            title="Resetuj iskorišćeni limit"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Confirm Reset */}
            {confirmReset !== null && (
                <div className="amp-modal-overlay" onClick={() => setConfirmReset(null)}>
                    <div className="amp-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="amp-modal-title">Potvrda resetovanja</h3>
                        <p className="amp-modal-text">
                            Da li ste sigurni da želite da resetujete iskorišćeni limit na <strong>0</strong> za ovog agenta?
                        </p>
                        <div className="amp-modal-actions">
                            <button className="amp-btn-cancel-modal" onClick={() => setConfirmReset(null)}>Odustani</button>
                            <button className="amp-btn-confirm" onClick={() => handleResetUsed(confirmReset)}>Potvrdi reset</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}