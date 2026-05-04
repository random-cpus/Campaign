// Matches the actual Appwrite-based backend response structure
export interface Campaign {
  $id: string;
  name: string;
  advertiser_offer_url: string;
  tracking_url: string;
  postback_url: string | null;
  status: 'active' | 'paused';
  events?: string[];
  $createdAt?: string;
  $updatedAt?: string;
}

