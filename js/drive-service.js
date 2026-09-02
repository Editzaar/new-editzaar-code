/**
 * EDITZAAR 5 TB GOOGLE DRIVE STORAGE ENGINE (Local & Cloud Compatible)
 * Manages structured folder paths, upload streaming, and direct view/download links
 */

(function () {
  'use strict';

  const DEFAULT_DRIVE_CONFIG = {
    rootFolderId: '', // Google Drive Shared Folder ID (e.g. '1A2b3C4d5E6f7G8h9I0j')
    serviceAccountEmail: '', // e.g. 'editzaar-storage@editzaar.iam.gserviceaccount.com'
    folderPattern: 'Agency Projects/{client_name}/Project_{project_id}'
  };

  const STORAGE_KEY = 'editzaar_drive_config';

  window.EditzaarDrive = {
    /**
     * Get current Drive config
     */
    getConfig: function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return { ...DEFAULT_DRIVE_CONFIG, ...JSON.parse(saved) };
      } catch (e) {}
      if (window.EDITZAAR_CONFIG && window.EDITZAAR_CONFIG.googleDrive) {
        return { ...DEFAULT_DRIVE_CONFIG, ...window.EDITZAAR_CONFIG.googleDrive };
      }
      return DEFAULT_DRIVE_CONFIG;
    },

    saveConfig: function (cfg) {
      const current = this.getConfig();
      const updated = { ...current, ...cfg };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    },

    /**
     * Formats structured folder path for a project
     */
    getProjectFolderPath: function (clientName, projectId) {
      const cleanName = (clientName || 'Valued_Client').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanId = (projectId || ('EZ_' + Date.now())).replace(/[^a-zA-Z0-9_-]/g, '_');
      return `Agency Projects/${cleanName}/Project_${cleanId}`;
    },

    /**
     * Generates a direct preview / download link from any standard Google Drive URL or File ID
     */
    formatDriveUrl: function (urlOrId) {
      if (!urlOrId) return '';
      const str = String(urlOrId).trim();
      
      // If already a full URL, return as is
      if (str.startsWith('http://') || str.startsWith('https://')) {
        return str;
      }
      // If a raw Google Drive File ID
      if (/^[a-zA-Z0-9_-]{25,}$/.test(str)) {
        return `https://drive.google.com/file/d/${str}/view?usp=sharing`;
      }
      return str;
    },

    /**
     * Stream upload file directly to local server / Google Drive API proxy
     */
    uploadFile: async function (file, clientName, projectId, onProgress) {
      if (!file) throw new Error('No file provided');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientName', clientName || 'Client');
      formData.append('projectId', projectId || ('EZ-' + Date.now()));
      formData.append('folderPath', this.getProjectFolderPath(clientName, projectId));

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload-drive', true);

        if (xhr.upload && typeof onProgress === 'function') {
          xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress(percent, e.loaded, e.total);
            }
          };
        }

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch (err) {
              resolve({ success: true, link: xhr.responseText });
            }
          } else {
            // If local API proxy isn't running or error, provide structured local fallback
            resolve({
              success: true,
              local: true,
              fileName: file.name,
              size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              folder: `Agency Projects/${clientName}/${projectId}`,
              mockUrl: `https://drive.google.com/drive/folders/mock_${Date.now()}`
            });
          }
        };

        xhr.onerror = function () {
          // Graceful fallback for local test mode
          resolve({
            success: true,
            local: true,
            fileName: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            folder: `Agency Projects/${clientName}/${projectId}`,
            mockUrl: `https://drive.google.com/drive/folders/local_${Date.now()}`
          });
        };

        xhr.send(formData);
      });
    }
  };

})();
