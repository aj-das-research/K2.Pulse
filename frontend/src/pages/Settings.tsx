import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SettingsPage = () => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [agentToggles, setAgentToggles] = useState({ sentinel: true, reasoner: true, epidemiologist: true });
  const [notifToggles, setNotifToggles] = useState({ telegram: true, email: false, slack: true });

  const toggleKey = (key: string) => setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-3xl space-y-6">
      {/* API Configuration */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-4">API Configuration</h3>
        <div className="space-y-3">
          {["OpenFDA API Key", "PubMed API Key", "DrugBank API Key"].map((label) => (
            <div key={label}>
              <label className="text-[11px] text-muted-foreground mb-1 block">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type={showKeys[label] ? "text" : "password"}
                  defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary/50"
                />
                <button onClick={() => toggleKey(label)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  {showKeys[label] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Configuration */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-4">Agent Configuration</h3>
        <div className="space-y-3">
          {([["sentinel", "SentinelAgent"], ["reasoner", "ReasonerAgent"], ["epidemiologist", "EpidemiologistAgent"]] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{agentToggles[key] ? "Active" : "Inactive"}</p>
              </div>
              <button
                onClick={() => setAgentToggles((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={`relative h-5 w-9 rounded-full transition-colors ${agentToggles[key] ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform ${agentToggles[key] ? "left-[18px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {([["telegram", "Telegram Alerts"], ["email", "Email Alerts"], ["slack", "Slack Alerts"]] as const).map(([key, label]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-foreground">{label}</p>
                <button
                  onClick={() => setNotifToggles((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`relative h-5 w-9 rounded-full transition-colors ${notifToggles[key] ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform ${notifToggles[key] ? "left-[18px]" : "left-0.5"}`} />
                </button>
              </div>
              {notifToggles[key] && (
                <input
                  placeholder="Webhook URL..."
                  className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary/50"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">About</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Version", value: "0.1.0-alpha" },
            { label: "Model", value: "K2 Think V2 (73B)" },
            { label: "Framework", value: "OpenClaw v2026.2" },
          ].map((i) => (
            <div key={i.label} className="rounded-lg bg-muted/50 p-3">
              <p className="text-[10px] text-muted-foreground">{i.label}</p>
              <p className="text-xs font-mono text-foreground mt-0.5">{i.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
