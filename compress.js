import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = './public';

const MAX_WIDTH = 1920;

async function compressImages() {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(dir, file);
    const tempPath = path.join(dir, 'temp_' + file);

    try {
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        console.log(`Processing ${file}...`);
        const metadata = await sharp(filePath).metadata();
        
        let transform = sharp(filePath);
        
        if (metadata.width > MAX_WIDTH) {
          transform = transform.resize({ width: MAX_WIDTH, withoutEnlargement: true });
        }

        if (ext === '.png') {
          await transform.png({ quality: 75, compressionLevel: 9 }).toFile(tempPath);
        } else {
          await transform.jpeg({ quality: 75, progressive: true }).toFile(tempPath);
        }

        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        console.log(`Compressed ${file}`);
      }
    } catch (err) {
      console.error(`Error compressing ${file}:`, err);
    }
  }
}

compressImages();
