import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCurrentUser, getSiteAccess } from "@/App";
import { toast } from "sonner";
import { Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { consumeAuthToken, upsertUser } from "@/lib/firestoreApi";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error(t("authFailed") + ": " + error);
      navigate("/login");
      return;
    }

    if (!token) {
      toast.error(t("noTokenReceived"));
      navigate("/login");
      return;
    }

    (async () => {
      try {
        // Consume one-time token written by Firebase Function
        const userData = await consumeAuthToken(token);
        // Upsert user in Firestore (idempotent)
        await upsertUser(userData);
        // Store user in localStorage as "session"
        setCurrentUser(userData);
        toast.success(t("welcomeToRealm"));
        navigate("/");
      } catch (e) {
        console.error(e);
        toast.error(t("authFailed") + ": " + e.message);
        navigate("/login");
      }
    })();
  }, [searchParams, navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center app-container">
      <div className="text-center">
        <Flame className="w-16 h-16 animate-fire text-orange-500 mx-auto mb-4"
          style={{ filter: "drop-shadow(0 0 20px rgba(255, 100, 0, 0.8))" }} />
        <p className="text-amber-200/80 font-cinzel tracking-wider">{t("authenticating")}</p>
      </div>
    </div>
  );
}
