import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class VercelDeployer {
    constructor() {
        this.projectDir = process.cwd();
        this.vercelConfig = {
            version: 2,
            builds: [
                {
                    src: "src/server.js",
                    use: "@vercel/node"
                }
            ],
            routes: [
                {
                    src: "/(.*)",
                    dest: "src/server.js"
                }
            ]
        };
    }

    async deploy() {
        console.log('🚀 Starting Vercel deployment...');
        
        try {
            // ایجاد فایل vercel.json
            this.createVercelConfig();
            
            // بررسی وجود vercel CLI
            try {
                execSync('vercel --version', { stdio: 'pipe' });
            } catch (error) {
                console.log('📦 Installing Vercel CLI...');
                execSync('npm install -g vercel', { stdio: 'inherit' });
            }

            // استقرار
            console.log('🌐 Deploying to Vercel...');
            execSync('vercel --prod', { stdio: 'inherit', cwd: this.projectDir });

            console.log('✅ Deployment completed successfully!');
            
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            process.exit(1);
        }
    }

    createVercelConfig() {
        const configPath = path.join(this.projectDir, 'vercel.json');
        fs.writeFileSync(configPath, JSON.stringify(this.vercelConfig, null, 2));
        console.log('✅ Vercel configuration created');
    }
}

// اجرای استقرار
const deployer = new VercelDeployer();
deployer.deploy();
