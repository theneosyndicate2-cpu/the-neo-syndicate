import { siteConfig } from "@/lib/site";

/** Branded verification-code email (inline styles for email-client compatibility). */
export function verificationEmail({ code, minutes }: { code: string; minutes: number }) {
  const subject = `${code} is your Neo Syndicate verification code`;
  const spaced = code.split("").join(" ");

  const text = [
    `THE NEO SYNDICATE — ${siteConfig.tagline.toUpperCase()}`,
    "",
    `Your verification code is: ${code}`,
    "",
    `Enter this code on the application page to confirm your email address. It expires in ${minutes} minutes.`,
    "",
    "If you didn't request this, you can ignore this email. We will never ask you for passwords, private keys or payments by email.",
    "",
    siteConfig.signature.toUpperCase(),
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#030405;font-family:Arial,Helvetica,sans-serif;color:#eef1f2;">
  <div style="display:none;max-height:0;overflow:hidden;">Your verification code is ${code}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#030405;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0c0f12;border:1px solid #1d242a;border-radius:12px;">
        <tr><td style="height:2px;background:linear-gradient(90deg,#030405,#d4af5f,#38e1ff,#030405);border-radius:12px 12px 0 0;"></td></tr>
        <tr><td style="padding:36px 36px 8px;">
          <div style="font-size:10px;letter-spacing:6px;color:#d4af5f;">THE</div>
          <div style="font-size:16px;letter-spacing:6px;color:#eef1f2;font-weight:bold;margin-top:4px;">NEO SYNDICATE</div>
        </td></tr>
        <tr><td style="padding:24px 36px 0;">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:3px;color:#38e1ff;">// EMAIL VERIFICATION</div>
          <h1 style="margin:14px 0 0;font-size:24px;font-weight:300;color:#eef1f2;">Confirm your email address</h1>
          <p style="margin:14px 0 0;font-size:14px;line-height:22px;color:#aeb6bb;">Enter this code on the application page to continue. It expires in ${minutes} minutes.</p>
        </td></tr>
        <tr><td style="padding:28px 36px;">
          <div style="background:#030405;border:1px solid #2a3238;border-radius:8px;padding:22px;text-align:center;">
            <div style="font-family:'Courier New',monospace;font-size:34px;letter-spacing:10px;color:#f0dba6;font-weight:bold;">${spaced}</div>
          </div>
        </td></tr>
        <tr><td style="padding:0 36px 32px;">
          <p style="margin:0;font-size:12px;line-height:19px;color:#7c868c;">If you didn't request this, you can safely ignore this email. The Neo Syndicate will never ask for passwords, private keys or payments by email.</p>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #1d242a;">
          <div style="font-size:11px;letter-spacing:4px;color:#d4af5f;">${siteConfig.signature.toUpperCase()}</div>
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:11px;color:#525b61;">The Neo Syndicate · Private members' desk</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
