import ImageKit from 'imagekit';
import fs from 'fs';
import path from 'path';
import { config } from '../config/environment';

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: config.imagekit.publicKey,
    privateKey: config.imagekit.privateKey,
    urlEndpoint: config.imagekit.urlEndpoint,
});

// Image categories mapping
const imageCategories = {
    'hero': 'hero-bg.jpg',
    'categories': [
        'living-room-category-scaled-qkja4tj10g8b6d9boyucdr5m2rg0w40p5781kag3xw.jpg',
        'bedroom-categories-scaled-qkr2tbqbg6jcbtwfh720uf14f5mfhb7fduyloae9kk.jpg',
        'dining-category-scaled-qkjbggyhh3glqq1kg2cha89u6ykw3q6u11t6e9smic.jpg'
    ],
    'products': [
        'sofa-qwbznzez6ecafcz2i0khdxjgm8oaxfhbaowvi3qo0y.png',
        'bed-2.webp',
        'coffee-hero.webp',
        'dining-2.webp'
    ],
    'icons': [
        'fast-delivery-qwbzfe62pwkybng9nsw83lkt6h0jl0dmg6a4m2h6w2.png',
        'trees_2633719-qwc1ydxmbj588pa1bmv1z4y7eaipq6m6mjta3dk6jm.png'
    ]
};

// Base path to the clone files
const cloneBasePath = path.join(__dirname, '../../../../tangerinefurniture.co.ke/wp-content/uploads');

async function uploadImageToImageKit(imagePath: string, fileName: string, folder: string): Promise<string> {
    try {
        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);

        // Upload to ImageKit
        const result = await imagekit.upload({
            file: imageBuffer,
            fileName: fileName,
            folder: `/tangerine/${folder}`,
            useUniqueFileName: false
        });

        console.log(`✅ Uploaded: ${fileName} -> ${result.url}`);
        return result.url;
    } catch (error) {
        console.error(`❌ Failed to upload ${fileName}:`, error);
        throw error;
    }
}

async function uploadAllImages() {
    console.log('🚀 Starting image upload to ImageKit...\n');

    const uploadedImages: { [key: string]: string } = {};

    try {
        // Upload hero image
        const heroPath = path.join(cloneBasePath, 'elementor/thumbs', imageCategories.hero);
        if (fs.existsSync(heroPath)) {
            uploadedImages.hero = await uploadImageToImageKit(heroPath, imageCategories.hero, 'hero');
        } else {
            console.log('⚠️ Hero image not found, skipping...');
        }

        // Upload category images
        console.log('\n📁 Uploading category images...');
        for (const categoryImage of imageCategories.categories) {
            const categoryPath = path.join(cloneBasePath, 'elementor/thumbs', categoryImage);
            if (fs.existsSync(categoryPath)) {
                const url = await uploadImageToImageKit(categoryPath, categoryImage, 'categories');
                uploadedImages[`category_${categoryImage}`] = url;
            }
        }

        // Upload product images
        console.log('\n🛋️ Uploading product images...');
        for (const productImage of imageCategories.products) {
            const productPath = path.join(cloneBasePath, 'elementor/thumbs', productImage);
            if (fs.existsSync(productPath)) {
                const url = await uploadImageToImageKit(productPath, productImage, 'products');
                uploadedImages[`product_${productImage}`] = url;
            }
        }

        // Upload icon images
        console.log('\n🎨 Uploading icon images...');
        for (const iconImage of imageCategories.icons) {
            const iconPath = path.join(cloneBasePath, 'elementor/thumbs', iconImage);
            if (fs.existsSync(iconPath)) {
                const url = await uploadImageToImageKit(iconPath, iconImage, 'icons');
                uploadedImages[`icon_${iconImage}`] = url;
            }
        }

        // Upload additional images from different folders
        console.log('\n📸 Uploading additional images...');

        // Upload from 2025/05 folder
        const additionalPath2025 = path.join(cloneBasePath, '2025/05');
        if (fs.existsSync(additionalPath2025)) {
            const files = fs.readdirSync(additionalPath2025);
            for (const file of files) {
                if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
                    const filePath = path.join(additionalPath2025, file);
                    const url = await uploadImageToImageKit(filePath, file, 'additional');
                    uploadedImages[`additional_${file}`] = url;
                }
            }
        }

        // Generate ImageKit URLs mapping
        console.log('\n📋 Generated ImageKit URLs:');
        console.log('='.repeat(50));

        for (const [key, url] of Object.entries(uploadedImages)) {
            console.log(`${key}: ${url}`);
        }

        // Save mapping to file
        const mappingPath = path.join(__dirname, '../config/imagekit-urls.json');
        fs.writeFileSync(mappingPath, JSON.stringify(uploadedImages, null, 2));
        console.log(`\n💾 URLs mapping saved to: ${mappingPath}`);

        console.log('\n🎉 All images uploaded successfully!');

    } catch (error) {
        console.error('❌ Error during upload:', error);
        process.exit(1);
    }
}

// Run the upload script
if (require.main === module) {
    uploadAllImages();
}

export { uploadAllImages };
