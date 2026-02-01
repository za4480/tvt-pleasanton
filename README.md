# Tri-Valley Tech Pleasanton Website

Official website for the Tri-Valley Tech Pleasanton chapter, led by Zayan Ahmad.

## 🚀 How to Publish to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the "+" icon in the top right and select "New repository"
3. Name it: `tvt-pleasanton` (or any name you prefer)
4. Make it **Public**
5. Do NOT initialize with README (we already have files)
6. Click "Create repository"

### Step 2: Push Your Code to GitHub

Run these commands in your terminal:

```bash
cd "/Users/zayanahmad/Downloads/Computer sci/CS 2/website-project"
git init
git add .
git commit -m "Initial commit: TVT Pleasanton website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tvt-pleasanton.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" (top right)
3. Scroll down and click "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select branch: **main** and folder: **/ (root)**
6. Click "Save"
7. Wait a few minutes, then your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/tvt-pleasanton/
   ```

## 📁 Project Structure

- `index.html` - Main HTML file with all content
- `styles.css` - All styling and animations
- `script.js` - JavaScript for smooth scrolling and interactions
- `README.md` - This file

## ✨ Features

- Responsive design (works on mobile, tablet, desktop)
- Smooth scrolling navigation
- Animated hover effects
- Modern gradient design matching Fremont chapter
- Team section featuring Zayan Ahmad as President

## 🎨 Customization

Want to customize the site? Here's how:

### Change Colors
Edit `styles.css` and search for:
- `#6366f1` (main purple)
- `#8b5cf6` (secondary purple)

Replace with your preferred colors!

### Update Content
Edit `index.html` to change:
- Stats and numbers
- Program descriptions
- Team members
- Contact email

### Add Team Members
Find the "Team Section" in `index.html` and duplicate the team-card div.

## 📧 Contact

Questions? Email: [pleasanton@trivalleytech.org](mailto:pleasanton@trivalleytech.org)

---

Built with ❤️ by Zayan Ahmad for Tri-Valley Tech Pleasanton
