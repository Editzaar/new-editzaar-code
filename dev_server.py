import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.error

PORT = 8080

class EditzaarDevServerHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        # 1. Telegram Notification Proxy Endpoint
        if self.path == '/api/notify-telegram':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                chat_id = data.get('chat_id')
                text = data.get('text')
                bot_token = data.get('bot_token') or os.environ.get('TELEGRAM_BOT_TOKEN', '')

                if bot_token and chat_id and text:
                    tg_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                    req_payload = json.dumps({
                        "chat_id": chat_id,
                        "text": text,
                        "parse_mode": data.get("parse_mode", "HTML")
                    }).encode('utf-8')

                    req = urllib.request.Request(tg_url, data=req_payload, headers={'Content-Type': 'application/json'})
                    with urllib.request.urlopen(req, timeout=10) as response:
                        res_body = response.read()
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(res_body)
                        return
                else:
                    print(f"\n[LOCAL TELEGRAM ALERT LOG]\nChat ID: {chat_id}\n{text}\n")
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "mode": "local_logged"}).encode('utf-8'))
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        # 2. Local Google Drive Upload Handler / Mock
        elif self.path == '/api/upload-drive':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                _ = self.rfile.read(content_length)

            response_data = {
                "success": True,
                "message": "File streamed successfully to 5TB Google Drive queue",
                "folderPath": "Agency Projects/Client_Uploads",
                "driveShareUrl": f"https://drive.google.com/drive/folders/editzaar_upload_{int(os.path.getmtime(__file__))}"
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            return

        return super().do_POST()

    def do_GET(self):
        url_path = self.path.split('?')[0].split('#')[0]
        # Clean URL rewrite support (e.g. /pricing -> /pricing.html)
        if url_path != '/' and not os.path.exists('.' + url_path):
            if os.path.exists('.' + url_path + '.html'):
                query_hash = self.path[len(url_path):]
                self.path = url_path + '.html' + query_hash
        return super().do_GET()

if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), EditzaarDevServerHandler) as httpd:
        print(f"[Editzaar] Dev server running at http://localhost:{PORT}")
        print(f"[Editzaar] Features: Clean URLs + /api/notify-telegram + /api/upload-drive active")
        sys.stdout.flush()
        httpd.serve_forever()
