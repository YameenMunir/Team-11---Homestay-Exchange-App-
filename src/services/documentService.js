import supabase from '../utils/supabase';

/**
 * Document service for handling user document storage and retrieval
 *
 * This service handles:
 * - Generating signed URLs for secure document access
 * - Fetching documents with authentication
 */
export const documentService = {
  /**
   * Generate a signed URL for a document stored in Supabase Storage
   *
   * @param {string} filePath - The path to the file in storage (e.g., "user_id/document.pdf")
   * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns {Promise<string|null>} - The signed URL or null if error
   */
  async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      if (!filePath) {
        console.warn('No file path provided to getSignedUrl');
        return null;
      }

      // Extract just the path if it's a full URL
      let storagePath = filePath;

      // Handle different URL formats:
      // 1. Full public URL: https://.../storage/v1/object/public/user-documents/path/to/file.pdf
      // 2. Storage path only: path/to/file.pdf or user-id/document.pdf
      if (filePath.includes('http')) {
        // Extract path from full URL
        const pathMatch = filePath.match(/user-documents\/(.+)$/);
        if (pathMatch) {
          storagePath = pathMatch[1];
        } else {
          console.error('Could not extract storage path from URL:', filePath);
          return null;
        }
      }

      // Remove any leading slashes
      storagePath = storagePath.replace(/^\/+/, '');

      console.log(`Generating signed URL for: ${storagePath}`);

      const { data, error } = await supabase.storage
        .from('user-documents')
        .createSignedUrl(storagePath, expiresIn);

      if (error) {
        console.error('Error creating signed URL for', storagePath, ':', error);
        return null;
      }

      if (!data?.signedUrl) {
        console.error('No signed URL returned for:', storagePath);
        return null;
      }

      console.log(`✅ Successfully generated signed URL for: ${storagePath}`);
      return data.signedUrl;
    } catch (error) {
      console.error('Error in getSignedUrl:', error);
      return null;
    }
  },

  /**
   * Get signed URLs for multiple documents
   *
   * @param {Array<string>} filePaths - Array of file paths
   * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns {Promise<Object>} - Map of file path to signed URL
   */
  async getSignedUrls(filePaths, expiresIn = 3600) {
    try {
      const signedUrls = {};

      await Promise.all(
        filePaths.map(async (filePath) => {
          if (filePath) {
            const signedUrl = await this.getSignedUrl(filePath, expiresIn);
            if (signedUrl) {
              signedUrls[filePath] = signedUrl;
            }
          }
        })
      );

      return signedUrls;
    } catch (error) {
      console.error('Error getting signed URLs:', error);
      return {};
    }
  },

  /**
   * Get signed URLs for user documents by user ID
   * Fetches all documents for a user and returns signed URLs
   *
   * @param {string} userId - The user's ID
   * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns {Promise<Object>} - Map of document types to signed URLs
   */
  async getUserDocumentUrls(userId, expiresIn = 3600) {
    try {
      // Fetch documents from database
      const { data: documents, error } = await supabase
        .from('user_documents')
        .select('document_type, file_url')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user documents:', error);
        return {};
      }

      if (!documents || documents.length === 0) {
        return {};
      }

      // Generate signed URLs for each document
      const documentUrls = {};

      await Promise.all(
        documents.map(async (doc) => {
          const signedUrl = await this.getSignedUrl(doc.file_url, expiresIn);
          if (signedUrl) {
            documentUrls[doc.document_type] = signedUrl;
          }
        })
      );

      return documentUrls;
    } catch (error) {
      console.error('Error getting user document URLs:', error);
      return {};
    }
  }
};
