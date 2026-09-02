/**
 * EDITZAAR ENTERPRISE TELEGRAM NOTIFICATION & ROUTING ENGINE
 * 
 * Architecture:
 * 1. Admin Master Channel/Chat: Receives 100% of agency alerts (orders, payments, chats, uploads).
 * 2. Editor-Specific Alerts: When a project is assigned or has new client messages,
 *    only the assigned editor's Telegram Chat ID receives the alert + direct workspace link.
 * 3. Live Admin Panel Control: Admin can configure bot credentials and editor Telegram IDs live.
 */

(function () {
  'use strict';

  const DEFAULT_CONFIG = {
    botToken: '8981464059:AAGGj-_U6FGdN9ahEOgvezgFRvz98TGmpYQ',
    adminChatId: '6432944929',
    enabled: true
  };

  const STORAGE_KEY = 'editzaar_telegram_config';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  window.EditzaarTelegram = {
    /**
     * Get current Telegram master configuration
     */
    getConfig: function () {
      let cfg = { ...DEFAULT_CONFIG };
      if (window.EDITZAAR_CONFIG && window.EDITZAAR_CONFIG.telegram) {
        if (window.EDITZAAR_CONFIG.telegram.botToken) cfg.botToken = window.EDITZAAR_CONFIG.telegram.botToken;
        if (window.EDITZAAR_CONFIG.telegram.adminChatId) cfg.adminChatId = window.EDITZAAR_CONFIG.telegram.adminChatId;
      }
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.botToken && String(parsed.botToken).trim()) cfg.botToken = String(parsed.botToken).trim();
          if (parsed.adminChatId && String(parsed.adminChatId).trim()) cfg.adminChatId = String(parsed.adminChatId).trim();
          else if (parsed.chatId && String(parsed.chatId).trim()) cfg.adminChatId = String(parsed.chatId).trim();
        }
      } catch (e) {}
      if (!cfg.botToken || !String(cfg.botToken).trim()) cfg.botToken = DEFAULT_CONFIG.botToken;
      if (!cfg.adminChatId || !String(cfg.adminChatId).trim()) cfg.adminChatId = DEFAULT_CONFIG.adminChatId;
      return cfg;
    },

    /**
     * Save master Telegram config locally and broadcast
     */
    saveConfig: function (cfg) {
      const current = this.getConfig();
      const updated = { ...current, ...cfg };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    },

    /**
     * Safe HTML message sender (avoids Telegram Markdown parsing errors on URLs / emails)
     */
    sendToChat: async function (targetChatId, htmlText) {
      const config = this.getConfig();
      const botToken = config.botToken || '8981464059:AAGGj-_U6FGdN9ahEOgvezgFRvz98TGmpYQ';
      const chatId = targetChatId || config.adminChatId || '6432944929';

      if (!botToken || !chatId) {
        console.info(`[EditzaarTelegram] Dispatch logged (Target: ${chatId}):\n`, htmlText);
        return { success: false, reason: 'unconfigured', payload: htmlText };
      }

      const payload = {
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        bot_token: botToken
      };

      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      try {
        if (isLocal) {
          const localProxy = await fetch('/api/notify-telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => null);

          if (localProxy && localProxy.ok) {
            const proxyData = await localProxy.json();
            console.log('[EditzaarTelegram] Dispatched via local proxy:', proxyData);
            return { success: true, data: proxyData };
          }
        }

        // Direct Telegram API
        const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: htmlText,
            parse_mode: 'HTML',
            disable_web_page_preview: false
          })
        });

        if (res.ok) {
          const data = await res.json();
          console.log('[EditzaarTelegram] Dispatched directly to Telegram:', data);
          return { success: true, data: data };
        } else {
          const errText = await res.text();
          console.warn('[EditzaarTelegram] Telegram API error:', errText);
          return { success: false, error: errText };
        }
      } catch (err) {
        console.warn('[EditzaarTelegram] Network notice:', err.message);
        return { success: false, error: err.message };
      }
    },

    /**
     * Send master alert to Admin Telegram
     */
    sendToAdmin: function (htmlText) {
      const config = this.getConfig();
      const targetId = config.adminChatId || config.chatId || '6432944929';
      return this.sendToChat(targetId, htmlText);
    },

    /**
     * 1. NEW CLIENT ORDER / PROJECT BRIEF ALERT (Goes to Admin Telegram)
     */
    sendOrderAlert: function (order) {
      const clientName = escapeHtml(order.name || order.clientName || 'Valued Client');
      const clientPhone = escapeHtml(order.phone || order.clientPhone || 'N/A');
      const clientEmail = escapeHtml(order.email || order.clientEmail || 'N/A');
      const pkg = escapeHtml(order.packageName || order.serviceName || 'Custom Video Project');
      const baseAmt = order.basePrice ? `₹${Number(order.basePrice).toLocaleString()}` : 'Custom';
      const paidAmt = order.paidAmount ? `₹${Number(order.paidAmount).toLocaleString()}` : '50% Advance';
      const remAmt = order.remainingAmount ? `₹${Number(order.remainingAmount).toLocaleString()}` : 'Balance on Delivery';
      const brief = escapeHtml((order.brief || order.instructions || 'No special instructions').substring(0, 400));
      const driveLink = escapeHtml(order.footageLink || order.driveLink || 'Not attached (upload in portal)');
      const orderId = escapeHtml(order.orderId || order.projectId || ('EZ-' + Math.floor(1000 + Math.random() * 9000)));
      const baseUrl = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://editzaar-fa8d9.web.app';

      const text = 
`🔔 <b>NEW CLIENT ORDER &amp; PROJECT BRIEF (${orderId})</b> 🔔

👤 <b>Client:</b> ${clientName}
📞 <b>Phone/WA:</b> <code>${clientPhone}</code>
📧 <b>Email:</b> <code>${clientEmail}</code>
🎬 <b>Package:</b> <b>${pkg}</b>
⏱ <b>Turnaround:</b> ${escapeHtml(order.delivery || '48 Hours')}

💵 <b>Financials:</b>
• Total Value: <b>${baseAmt}</b>
• Deposit Paid: <b>${paidAmt}</b>
• Remaining: <b>${remAmt}</b>

📝 <b>Client Brief:</b>
<i>${brief}</i>

📁 <b>Raw Footage / Assets:</b>
${driveLink}

⏰ <b>Time:</b> ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
👉 <a href="${baseUrl}/dashboard/admin.html"><b>Open Admin Dashboard to Assign Editor ↗</b></a>`;

      return this.sendToAdmin(text);
    },

    /**
     * 2. EDITOR ASSIGNMENT ALERT (Sent directly to Assigned Editor + Admin Log)
     */
    sendAssignmentAlert: function (data) {
      const editorName = escapeHtml(data.editorName || 'Editor');
      const editorChatId = data.editorTelegramChatId || '';
      const clientName = escapeHtml(data.clientName || 'Client');
      const projectTitle = escapeHtml(data.projectTitle || 'Video Project');
      const brief = escapeHtml((data.brief || data.description || 'Check workspace for details').substring(0, 350));
      const driveLink = escapeHtml(data.driveLink || data.rawFootageUrl || 'Link will be updated in workspace');
      const deadline = data.deadline ? new Date(data.deadline).toLocaleDateString('en-IN') : 'Standard 48h';
      const payout = data.editorPayout ? `₹${Number(data.editorPayout).toLocaleString()}` : 'Per-project rate';
      const baseUrl = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://editzaar-fa8d9.web.app';

      const editorText =
`🎬 <b>NEW PROJECT ASSIGNED TO YOU!</b> 🎬

Hi <b>${editorName}</b>, Admin has assigned you a new project:

📌 <b>Project:</b> <b>${projectTitle}</b>
👤 <b>Client:</b> ${clientName}
⏱ <b>Deadline:</b> <b>${deadline}</b>
💰 <b>Your Fee:</b> <b>${payout}</b>

📝 <b>Client Brief &amp; Instructions:</b>
<i>${brief}</i>

📁 <b>Raw Footage / Google Drive:</b>
${driveLink}

👉 <a href="${baseUrl}/dashboard/editor.html"><b>Open Editor Workspace to Chat &amp; Edit ↗</b></a>`;

      if (editorChatId) {
        this.sendToChat(editorChatId, editorText);
      }

      const adminLog = 
`👤 <b>PROJECT ASSIGNMENT UPDATE</b> 👤
📌 Project: <b>${projectTitle}</b>
✂️ Assigned Editor: <b>${editorName}</b> ${editorChatId ? '(Telegram Alert Sent ✅)' : '(No Telegram ID set)'}
⏱ Deadline: ${deadline}`;

      return this.sendToAdmin(adminLog);
    },

    /**
     * 3. CHAT MESSAGE ROUTING (Sent to Assigned Editor Telegram + Admin)
     */
    sendChatAlert: function (chatData) {
      const sender = escapeHtml(chatData.senderName || 'Client');
      const projectTitle = escapeHtml(chatData.projectTitle || 'Project');
      const message = escapeHtml((chatData.message || '').substring(0, 350));
      const editorChatId = chatData.editorTelegramChatId || '';
      const isClientSender = chatData.isClient !== false;
      const baseUrl = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://editzaar-fa8d9.web.app';
      const workspaceUrl = isClientSender ? `${baseUrl}/dashboard/editor.html` : `${baseUrl}/dashboard/client.html`;

      const text =
`💬 <b>NEW PROJECT CHAT (${projectTitle})</b> 💬

👤 <b>From:</b> ${sender}
💬 <b>Message:</b>
"${message}"

👉 <a href="${workspaceUrl}"><b>Tap Here to Open Workspace &amp; Reply ↗</b></a>`;

      if (isClientSender && editorChatId) {
        this.sendToChat(editorChatId, text);
      }

      return this.sendToAdmin(text);
    },

    /**
     * 4. FOOTAGE UPLOAD ALERT
     */
    sendFileUploadAlert: function (fileData) {
      const clientName = escapeHtml(fileData.clientName || 'Client');
      const projectTitle = escapeHtml(fileData.projectTitle || 'Video Project');
      const link = escapeHtml(fileData.link || fileData.url || 'N/A');
      const editorChatId = fileData.editorTelegramChatId || '';

      const text =
`📤 <b>NEW RAW FOOTAGE UPLOADED</b> 📤

👤 <b>Client:</b> ${clientName}
📌 <b>Project:</b> <b>${projectTitle}</b>
📁 <b>Google Drive Link:</b>
${link}

⏱ <b>Time:</b> ${new Date().toLocaleTimeString('en-IN')}`;

      if (editorChatId) {
        this.sendToChat(editorChatId, text);
      }
      return this.sendToAdmin(text);
    },

    /**
     * 5. PAYMENT UTR / BALANCE SUBMISSION ALERT (Admin Only)
     */
    sendPaymentAlert: function (payData) {
      const clientName = escapeHtml(payData.clientName || 'Client');
      const projectTitle = escapeHtml(payData.projectTitle || 'Project');
      const amount = payData.amount ? `₹${Number(payData.amount).toLocaleString()}` : 'Balance';
      const utr = escapeHtml(payData.utr || 'N/A');

      const text =
`💳 <b>PAYMENT UTR SUBMITTED</b> 💳

👤 <b>Client:</b> ${clientName}
📌 <b>Project:</b> <b>${projectTitle}</b>
💰 <b>Amount:</b> <b>${amount}</b>
🔢 <b>Submitted UTR:</b> <code>${utr}</code>

👉 <i>Admin: Verify bank deposit to unlock client deliverables.</i>`;

      return this.sendToAdmin(text);
    },

    /**
     * 6. NEW CLIENT SIGNUP ALERT
     */
    sendClientSignupAlert: function (clientData) {
      const name = escapeHtml(clientData.name || 'New Client');
      const email = escapeHtml(clientData.email || 'N/A');
      const mobile = escapeHtml(clientData.mobile || 'N/A');

      const text =
`🎉 <b>NEW CLIENT REGISTERED ON PORTAL!</b> 🎉

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> <code>${email}</code>
📞 <b>Mobile:</b> <code>${mobile}</code>
⏰ <b>Time:</b> ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}

👉 <i>Admin: Check Admin Dashboard to view client profile or assign default editor.</i>`;

      return this.sendToAdmin(text);
    },

    /**
     * 7. CLIENT LOGIN ALERT (First/New Session)
     */
    sendClientLoginAlert: function (clientData) {
      const name = escapeHtml(clientData.name || clientData.displayName || 'Client');
      const email = escapeHtml(clientData.email || 'N/A');

      const text =
`🔑 <b>CLIENT LOGGED IN</b> 🔑

👤 <b>Client:</b> ${name} (<code>${email}</code>)
⏰ <b>Time:</b> ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

      return this.sendToAdmin(text);
    },

    /**
     * 8. SUPPORT TICKET ALERT (Admin Only)
     */
    sendSupportAlert: function (ticket) {
      const clientName = escapeHtml(ticket.name || ticket.clientName || 'Client');
      const clientEmail = escapeHtml(ticket.email || ticket.clientEmail || 'N/A');
      const subject = escapeHtml(ticket.subject || 'Support Request');
      const category = escapeHtml(ticket.category || 'General');
      const message = escapeHtml(ticket.message || 'N/A');

      const text =
`🆘 <b>NEW SUPPORT TICKET RAISED!</b> 🆘

👤 <b>Client:</b> ${clientName} (${clientEmail})
📂 <b>Category:</b> ${category}
📌 <b>Subject:</b> <b>${subject}</b>
📝 <b>Message:</b>
${message}

👉 <i>Admin: Reply via Admin Dashboard → Support Tickets.</i>`;

      return this.sendToAdmin(text);
    },

    /**
     * 9. CLIENT REVIEW / FEEDBACK ALERT (Admin Only)
     */
    sendReviewAlert: function (rev) {
      const clientName = escapeHtml(rev.name || rev.clientName || 'Client');
      const rating = rev.rating ? ('⭐'.repeat(rev.rating)) : '⭐⭐⭐⭐⭐';
      const comment = escapeHtml(rev.comment || rev.message || 'N/A');

      const text =
`⭐ <b>NEW CLIENT FEEDBACK / REVIEW!</b> ⭐

👤 <b>Client:</b> ${clientName}
🌟 <b>Rating:</b> ${rating}
💬 <b>Feedback:</b>
"${comment}"

👉 <i>Admin: Review and approve for website in Admin Dashboard → Reviews & Feedback.</i>`;

      return this.sendToAdmin(text);
    },

    /**
     * 10. TEST PING BOT CONNECTION
     */
    testConnection: async function (targetChatId) {
      const text = 
`⚡ <b>EDITZAAR TELEGRAM BOT CONNECTED SUCCESSFULLY!</b> ⚡

✅ Bot API is active &amp; listening.
📡 Real-time alerts for orders, chats, and assignments are ready.
⏰ Timestamp: ${new Date().toLocaleString('en-IN')}`;

      return this.sendToChat(targetChatId, text);
    }
  };

})();
