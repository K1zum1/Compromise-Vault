import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';


const generateKRL = async (keys, krlFilePath) => {
  return new Promise((resolve, reject) => {
   
    const krlInitCommand = `ssh-keygen -k -f ${krlFilePath}`;
    exec(krlInitCommand, (error, stdout, stderr) => {
      if (error) {
        return reject(`Error initializing KRL: ${stderr}`);
      }

      
      const keyAdditionPromises = keys.map((key) => {
        const keyFilePath = path.join('/tmp', `revoked-key-${Date.now()}.pub`);
        
        fs.writeFileSync(keyFilePath, key);

        const addKeyCommand = `ssh-keygen -k -u -f ${krlFilePath} ${keyFilePath}`;
        return new Promise((resolveKey, rejectKey) => {
          exec(addKeyCommand, (keyError, keyStdout, keyStderr) => {
            if (keyError) {
              return rejectKey(`Error adding key to KRL: ${keyStderr}`);
            }
            fs.unlinkSync(keyFilePath); 
            resolveKey();
          });
        });
      });

     
      Promise.all(keyAdditionPromises)
        .then(() => resolve())
        .catch(reject);
    });
  });
};

// API handler to generate KRL and provide for download
export default async function generateKRLHandler(req, res) {
  try {
    
    const keys = await fetchKeysFromDatabase(); // replace with actual database fetching logic

    const krlFilePath = path.join('/tmp', 'revoked-keys.krl');

    await generateKRL(keys, krlFilePath);

    res.setHeader('Content-Disposition', 'attachment; filename="revoked-keys.krl"');
    res.setHeader('Content-Type', 'application/octet-stream');
    const fileStream = fs.createReadStream(krlFilePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(krlFilePath);
    });

  } catch (error) {
    console.error('Error generating KRL:', error);
    res.status(500).json({ error: 'Failed to generate KRL' });
  }
}
