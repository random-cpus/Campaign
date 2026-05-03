# Resilience Media - Campaign Manager: Client Handover Guide

Welcome to your new Campaign Management Portal. This guide will walk you through how to use the dashboard to manage your advertising campaigns effectively.

## 1. Accessing the Portal
- **URL**: Navigate to your deployed Vercel domain.
- **Secure Access**: The system is protected by a secure authentication portal. You will need your master password (configured as `DASHBOARD_PASSWORD` in your environment variables). 
- *Note: Once logged in, your session is securely saved in your browser for 24 hours.*

## 2. Navigating the Dashboard
Once authenticated, you will see the **Campaign Hub**, which provides a complete overview of all your campaigns.
- **Filter by Status**: Use the dropdown at the top to quickly filter between *All Campaigns*, *Active Only*, and *Paused Only*.
- **Campaign List**: You will see all critical information at a glance: Campaign Name, ID, Status, Destination Offer URL, and quick actions to copy Tracking/Postback links.

## 3. Creating a New Campaign
1. Click the **"New Campaign"** button in the top right.
2. Enter a recognizable **Campaign Name** (e.g., "Summer Sale Promo 2026").
3. Enter the **Destination Offer URL** provided by your advertiser.
   - *Important Tip*: If you are passing dynamic variables, include them directly in the URL structure. For example: `https://example.com/offer?sub1={sub1}&sub2={sub2}`.
4. Click **Create Campaign**. The system will automatically generate the required Tracking Link and Postback URL on the backend and display them instantly.

## 4. Managing Existing Campaigns
You have full control over your active campaigns directly from the dashboard:

### A. Copying Links
- In the "Tracking & Postback Links" column, click **"Copy Link"** next to the Tracking or Postback rows. 
- You can provide these exact links to your traffic sources or affiliate partners.

### B. Editing the Offer URL
- If an advertiser changes their landing page URL, click the **Pencil Icon** next to the destination offer URL.
- Type in the new URL and click the **Checkmark Icon** to save it instantly.

### C. Pausing and Activating Campaigns
- Click the **Play/Pause Icon** in the far right column. 
- Pausing a campaign will immediately stop tracking and redirecting traffic for that specific campaign ID on the backend.

### D. Deleting a Campaign
- Click the **Red Trash Icon** to permanently remove a campaign. 
- *Warning*: This action cannot be undone and will permanently disable all associated tracking links.

## 5. Support and Troubleshooting
If you encounter a "Network error" or fail to see campaigns load:
- Ensure your backend API is online (`trk.resiliencemedia.tech`).
- Verify that your Vercel deployment environment variables (`API_AUTH_KEY`, `BACKEND_BASE_URL`, `SESSION_SECRET`, `DASHBOARD_PASSWORD`) are correctly configured.

Your system is designed with a premium, responsive interface that works flawlessly on desktop and tablet devices. Enjoy managing your campaigns!
