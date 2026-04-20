// Comprehensive product database with proper tagging for dynamic filtering

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'perfume' | 'bag' | 'watch' | 'dress' | 'skincare';
  occasions: string[]; // office, wedding, party, casual, date, brunch, festive, gym, travel
  styles: string[]; // minimal, bold, elegant, casual, trendy, classic, bohemian, streetwear, romantic, sporty
  gender: 'female' | 'male' | 'unisex';
  color?: string; // primary color tag for color-based filtering
  tags?: string[]; // extra tags: trending, bestseller, new-arrival, limited-edition, sustainable, luxury, handcrafted
  season?: string; // summer, winter, monsoon, all-season
}

// Helper to create products compactly
const p = (
  id: string, name: string, price: number, image: string,
  category: Product['category'], occasions: string[], styles: string[],
  gender: Product['gender'], color?: string, tags?: string[], season?: string
): Product => ({ id, name, price, image, category, occasions, styles, gender, color, tags, season });

// Unsplash image shortcuts
const img = (id: string, w = 400, h = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

export const productDatabase: Product[] = [
  // ═══════════════════════════════════════════════════════════════
  // FEMALE — WEDDING (Exclusive wedding products)
  // ═══════════════════════════════════════════════════════════════
  p('fw_top_1', 'Bridal Ivory Silk Blouse', 4890, img('1564859228273-274232fdb516'), 'top', ['wedding'], ['elegant'], 'female', 'ivory', ['bestseller']),
  p('fw_top_2', 'Gold Sequin Top', 6990, img('1618932260634-37f398ea8d8c'), 'top', ['wedding'], ['bold', 'elegant'], 'female', 'gold', ['trending']),
  p('fw_top_3', 'Rose Gold Satin Blouse', 5290, img('1595777457583-95e059d581b8'), 'top', ['wedding'], ['elegant'], 'female', 'rose-gold', []),
  p('fw_top_4', 'Emerald Embroidered Blouse', 5590, img('1583743814966-8936f5b7be1a'), 'top', ['wedding'], ['bold'], 'female', 'emerald', ['handcrafted']),
  p('fw_top_5', 'Pearl White Peplum Top', 4490, img('1562157873-818bc0726f68'), 'top', ['wedding'], ['elegant', 'minimal'], 'female', 'white', []),
  p('fw_top_6', 'Champagne Lace Corset', 7290, img('1551488831-00ddcb6c6bd3'), 'top', ['wedding'], ['bold', 'elegant'], 'female', 'champagne', ['luxury', 'trending']),
  p('fw_top_7', 'Zari Work Cape Top', 8490, img('1617019114583-affb34d1b3cd'), 'top', ['wedding'], ['bold', 'elegant'], 'female', 'gold', ['handcrafted', 'luxury']),

  p('fw_bot_1', 'Gold Pleated Lehenga Skirt', 8590, img('1583496661160-fb5886a0aaaa'), 'bottom', ['wedding'], ['elegant', 'bold'], 'female', 'gold', ['bestseller', 'handcrafted']),
  p('fw_bot_2', 'Ivory Silk Palazzo', 5890, img('1594633312681-425c7b97ccd1'), 'bottom', ['wedding'], ['elegant'], 'female', 'ivory', []),
  p('fw_bot_3', 'Red Bridal Sharara', 9290, img('1624378439575-d8705ad7ae80'), 'bottom', ['wedding'], ['bold'], 'female', 'red', ['handcrafted']),
  p('fw_bot_4', 'Champagne Maxi Skirt', 6290, img('1560243563-062bfc001d68'), 'bottom', ['wedding'], ['elegant'], 'female', 'champagne', []),
  p('fw_bot_5', 'Maroon Velvet Skirt', 5490, img('1583496661160-fb5886a0aaaa'), 'bottom', ['wedding'], ['bold', 'elegant'], 'female', 'maroon', []),

  p('fw_sho_1', 'Gold Strappy Heels', 5690, img('1562183241-b937e95585b6'), 'shoes', ['wedding'], ['bold', 'elegant'], 'female', 'gold', ['trending']),
  p('fw_sho_2', 'Crystal Embellished Pumps', 6490, img('1596702656356-baec4feee61a'), 'shoes', ['wedding'], ['elegant'], 'female', 'silver', ['luxury']),
  p('fw_sho_3', 'Rose Gold Stilettos', 5890, img('1543163521-1bf539c55dd2'), 'shoes', ['wedding'], ['elegant', 'bold'], 'female', 'rose-gold', []),
  p('fw_sho_4', 'Pearl White Block Heels', 4990, img('1549298916-b41d501d3772'), 'shoes', ['wedding'], ['elegant', 'minimal'], 'female', 'white', []),

  p('fw_acc_1', 'Diamond Pendant Necklace', 12590, img('1599643478518-a784e5dc4c8f'), 'accessory', ['wedding'], ['elegant'], 'female', 'silver', ['luxury', 'bestseller']),
  p('fw_acc_2', 'Gold Kundan Earrings', 8990, img('1535556116002-6281ff3e9f36'), 'accessory', ['wedding'], ['bold', 'elegant'], 'female', 'gold', ['handcrafted']),
  p('fw_acc_3', 'Emerald Ring', 14590, img('1605100804763-247f67b3557e'), 'accessory', ['wedding'], ['bold'], 'female', 'emerald', ['luxury']),
  p('fw_acc_4', 'Pearl Choker Set', 7490, img('1611591437281-460bfbe1220a'), 'accessory', ['wedding'], ['elegant'], 'female', 'pearl', []),
  p('fw_acc_5', 'Gold Maang Tikka Set', 6290, img('1599643478518-a784e5dc4c8f'), 'accessory', ['wedding'], ['bold', 'elegant'], 'female', 'gold', ['handcrafted']),
  p('fw_acc_6', 'Bridal Potli Bag', 3890, img('1566150905458-1bf1fc113f0d'), 'bag', ['wedding'], ['elegant', 'bold'], 'female', 'gold', ['handcrafted']),

  // FEMALE — WEDDING DRESSES
  p('fw_dress_1', 'Ivory Bridal Gown', 18990, img('1594552072238-b8a33785b261'), 'dress', ['wedding'], ['elegant', 'romantic'], 'female', 'ivory', ['luxury', 'handcrafted']),
  p('fw_dress_2', 'Gold Embroidered Lehenga Set', 22990, img('1610030469983-98e550d6193c'), 'dress', ['wedding'], ['bold', 'elegant'], 'female', 'gold', ['bestseller', 'handcrafted']),
  p('fw_dress_3', 'Champagne Anarkali Gown', 15990, img('1583391733956-6c78276477e9'), 'dress', ['wedding'], ['elegant'], 'female', 'champagne', ['trending']),
  p('fw_dress_4', 'Royal Blue Reception Gown', 19990, img('1566174053879-31528523f8ae'), 'dress', ['wedding'], ['bold', 'elegant'], 'female', 'blue', ['luxury']),
  p('fw_dress_5', 'Pastel Pink Bridal Lehenga', 24990, img('1572804013427-4d7ca7268217'), 'dress', ['wedding'], ['elegant', 'romantic'], 'female', 'pink', ['handcrafted', 'luxury']),

  // FEMALE — WEDDING PERFUMES
  p('fw_perf_1', 'Velour Rose Oud Eau de Parfum', 8990, img('1541643600914-78b084683601'), 'perfume', ['wedding'], ['elegant', 'romantic'], 'female', 'rose', ['bestseller', 'luxury']),
  p('fw_perf_2', 'Amber Velvet EDP', 7290, img('1541643600914-78b084683601'), 'perfume', ['wedding'], ['bold', 'elegant'], 'female', 'amber', ['luxury']),
  p('fw_perf_3', 'White Jasmine Bridal Mist', 4590, img('1592945403244-b40fafb8ae0d'), 'perfume', ['wedding'], ['elegant', 'romantic'], 'female', 'white', ['new-arrival']),

  // FEMALE — WEDDING WATCH
  p('fw_watch_1', 'Rose Gold Diamond Watch', 18990, img('1523170335258-f5ed11844a49'), 'watch', ['wedding'], ['elegant', 'bold'], 'female', 'rose-gold', ['luxury', 'bestseller']),

  // ═══════════════════════════════════════════════════
  // FEMALE — PARTY (Exclusive party products)
  // ═══════════════════════════════════════════════════
  p('fp_top_1', 'Black Satin Camisole', 3290, img('1581338834647-b0fb40704e21'), 'top', ['party'], ['bold'], 'female', 'black', ['trending']),
  p('fp_top_2', 'Red Velvet Crop Top', 3590, img('1562157873-818bc0726f68'), 'top', ['party'], ['bold'], 'female', 'red', []),
  p('fp_top_3', 'Metallic Silver Blouse', 4290, img('1595429035839-c99c298ffdde'), 'top', ['party'], ['bold', 'trendy'], 'female', 'silver', ['new-arrival']),
  p('fp_top_4', 'Sequin Halter Top', 3890, img('1618932260643-eee4a2f652a6'), 'top', ['party'], ['bold'], 'female', 'gold', ['trending']),
  p('fp_top_5', 'Deep Purple Bodysuit', 2990, img('1564859227995-d0e8e5baf5b6'), 'top', ['party'], ['bold', 'elegant'], 'female', 'purple', []),
  p('fp_top_6', 'Neon Green Party Top', 2790, img('1583743814966-8936f5b7be1a'), 'top', ['party'], ['bold', 'trendy'], 'female', 'green', ['new-arrival']),

  p('fp_bot_1', 'Black Leather Mini Skirt', 3890, img('1583496661160-fb5886a0aaaa'), 'bottom', ['party'], ['bold', 'trendy'], 'female', 'black', ['trending']),
  p('fp_bot_2', 'Red Sequin Pants', 4290, img('1624378439575-d8705ad7ae80'), 'bottom', ['party'], ['bold'], 'female', 'red', []),
  p('fp_bot_3', 'Metallic Gold Skirt', 3590, img('1560243563-062bfc001d68'), 'bottom', ['party'], ['bold', 'elegant'], 'female', 'gold', []),
  p('fp_bot_4', 'Black Slit Maxi Skirt', 3290, img('1594633312681-425c7b97ccd1'), 'bottom', ['party'], ['elegant', 'bold'], 'female', 'black', []),
  p('fp_bot_5', 'Glitter Wide Leg Pants', 4590, img('1624378439575-d8705ad7ae80'), 'bottom', ['party'], ['bold', 'trendy'], 'female', 'silver', ['new-arrival']),

  // FEMALE — PARTY DRESSES
  p('fp_dress_1', 'Sequin Cocktail Dress', 5990, img('1566174053879-31528523f8ae'), 'dress', ['party'], ['bold', 'trendy'], 'female', 'gold', ['trending', 'bestseller']),
  p('fp_dress_2', 'Black Bodycon Dress', 4290, img('1539008835657-9e8e9680c956'), 'dress', ['party'], ['bold', 'elegant'], 'female', 'black', ['trending']),
  p('fp_dress_3', 'Red Velvet Mini Dress', 4890, img('1572804013427-4d7ca7268217'), 'dress', ['party'], ['bold'], 'female', 'red', ['new-arrival']),
  p('fp_dress_4', 'Neon Pink Slip Dress', 3590, img('1539008835657-9e8e9680c956'), 'dress', ['party'], ['bold', 'trendy'], 'female', 'pink', ['new-arrival']),

  p('fp_sho_1', 'Black Stilettos', 4890, img('1596702656356-baec4feee61a'), 'shoes', ['party'], ['bold', 'elegant'], 'female', 'black', []),
  p('fp_sho_2', 'Red Platform Heels', 4290, img('1562183241-b937e95585b6'), 'shoes', ['party'], ['bold'], 'female', 'red', ['trending']),
  p('fp_sho_3', 'Silver Glitter Pumps', 3990, img('1549298916-b41d501d3772'), 'shoes', ['party'], ['bold'], 'female', 'silver', []),
  p('fp_sho_4', 'Clear Strap Heels', 3690, img('1543163521-1bf539c55dd2'), 'shoes', ['party'], ['bold', 'elegant', 'trendy'], 'female', 'neutral', ['trending']),

  p('fp_acc_1', 'Statement Crystal Earrings', 3290, img('1535556116002-6281ff3e9f36'), 'accessory', ['party'], ['bold'], 'female', 'silver', []),
  p('fp_acc_2', 'Black Clutch Bag', 2890, img('1566150905458-1bf1fc113f0d'), 'bag', ['party'], ['bold', 'elegant'], 'female', 'black', []),
  p('fp_acc_3', 'Layered Gold Chains', 4590, img('1599643478518-a784e5dc4c8f'), 'accessory', ['party'], ['bold', 'trendy'], 'female', 'gold', ['trending']),
  p('fp_acc_4', 'Sparkle Cuff Bracelet', 2490, img('1611591437281-460bfbe1220a'), 'accessory', ['party'], ['bold'], 'female', 'silver', []),

  // FEMALE — PARTY PERFUMES
  p('fp_perf_1', 'Midnight Orchid Intense', 9990, img('1592945403244-b40fafb8ae0d'), 'perfume', ['party'], ['bold'], 'female', 'purple', ['limited-edition', 'luxury']),
  p('fp_perf_2', 'Jasmine Noir Perfume', 6490, img('1594035910387-fea081e00a7e'), 'perfume', ['party'], ['bold', 'elegant'], 'female', 'gold', ['trending']),
  p('fp_perf_3', 'Electric Musk After Dark', 5490, img('1541643600914-78b084683601'), 'perfume', ['party'], ['bold', 'trendy'], 'female', 'black', ['new-arrival']),

  // ═══════════════════════════════════════════════════
  // FEMALE — OFFICE (Exclusive office products)
  // ═══════════════════════════════════════════════════
  p('fo_top_1', 'White Cotton Formal Shirt', 2490, img('1564859228273-274232fdb516'), 'top', ['office'], ['minimal', 'classic'], 'female', 'white', []),
  p('fo_top_2', 'Navy Tailored Blazer', 5490, img('1591369822096-ffd140ec948f'), 'top', ['office'], ['minimal', 'elegant'], 'female', 'navy', ['bestseller']),
  p('fo_top_3', 'Beige Silk Blouse', 3290, img('1617019114583-affb34d1b3cd'), 'top', ['office'], ['minimal', 'elegant'], 'female', 'beige', []),
  p('fo_top_4', 'Light Blue Oxford Shirt', 2690, img('1618932260643-eee4a2f652a6'), 'top', ['office'], ['minimal', 'classic'], 'female', 'blue', []),
  p('fo_top_5', 'Grey Turtleneck Knit', 3490, img('1617019114583-affb34d1b3cd'), 'top', ['office'], ['minimal', 'elegant'], 'female', 'grey', []),
  p('fo_top_6', 'Pinstripe Formal Shirt', 2890, img('1564859228273-274232fdb516'), 'top', ['office'], ['minimal', 'classic'], 'female', 'white', []),

  // FEMALE — OFFICE DRESSES
  p('fo_dress_1', 'Navy Pencil Dress', 4990, img('1583496661160-fb5886a0aaaa'), 'dress', ['office'], ['minimal', 'elegant'], 'female', 'navy', ['bestseller']),
  p('fo_dress_2', 'Charcoal Shift Dress', 4290, img('1594633312681-425c7b97ccd1'), 'dress', ['office'], ['minimal', 'classic'], 'female', 'charcoal', []),
  p('fo_dress_3', 'Emerald Wrap Midi Dress', 4690, img('1539008835657-9e8e9680c956'), 'dress', ['office'], ['elegant', 'classic'], 'female', 'emerald', ['new-arrival']),

  p('fo_bot_1', 'Black Pencil Skirt', 2990, img('1583496661160-fb5886a0aaaa'), 'bottom', ['office'], ['minimal', 'elegant', 'classic'], 'female', 'black', []),
  p('fo_bot_2', 'Grey Tailored Trousers', 3690, img('1594633312681-425c7b97ccd1'), 'bottom', ['office'], ['minimal'], 'female', 'grey', []),
  p('fo_bot_3', 'Beige Wide Leg Pants', 3490, img('1594633312681-425c7b97ccd1'), 'bottom', ['office'], ['minimal', 'elegant'], 'female', 'beige', []),
  p('fo_bot_4', 'Navy Formal Pants', 3290, img('1624378439575-d8705ad7ae80'), 'bottom', ['office'], ['minimal', 'classic'], 'female', 'navy', []),
  p('fo_bot_5', 'Charcoal Ankle Trousers', 3190, img('1594633312681-425c7b97ccd1'), 'bottom', ['office'], ['minimal', 'elegant'], 'female', 'charcoal', []),

  p('fo_sho_1', 'Nude Pointed Pumps', 4290, img('1543163521-1bf539c55dd2'), 'shoes', ['office'], ['minimal', 'elegant'], 'female', 'nude', []),
  p('fo_sho_2', 'Black Leather Loafers', 3490, img('1543163521-1bf539c55dd2'), 'shoes', ['office'], ['minimal', 'classic'], 'female', 'black', []),
  p('fo_sho_3', 'Navy Suede Pumps', 3890, img('1543163521-1bf539c55dd2'), 'shoes', ['office'], ['minimal', 'elegant'], 'female', 'navy', []),
  p('fo_sho_4', 'Tan Oxford Flats', 2990, img('1549298916-b41d501d3772'), 'shoes', ['office'], ['minimal', 'classic'], 'female', 'tan', []),

  p('fo_acc_1', 'Leather Tote Bag', 5490, img('1584917865442-de89df76afd3'), 'bag', ['office'], ['minimal', 'classic'], 'female', 'brown', ['bestseller']),
  p('fo_acc_2', 'Silver Minimalist Watch', 9890, img('1523170335258-f5ed11844a49'), 'watch', ['office'], ['minimal', 'elegant'], 'female', 'silver', ['trending']),
  p('fo_acc_3', 'Pearl Stud Earrings', 2490, img('1535556116002-6281ff3e9f36'), 'accessory', ['office'], ['minimal', 'elegant', 'classic'], 'female', 'pearl', []),
  p('fo_acc_4', 'Silk Scarf', 1890, img('1601924994987-69e26d50dc26'), 'accessory', ['office'], ['elegant', 'classic'], 'female', 'multicolor', []),

  // FEMALE — OFFICE PERFUMES
  p('fo_perf_1', 'White Gardenia EDT', 3990, img('1592945403244-b40fafb8ae0d'), 'perfume', ['office'], ['minimal', 'elegant'], 'female', 'white', ['new-arrival']),
  p('fo_perf_2', 'Fresh Linen & Cotton Mist', 1990, img('1588405748880-12d1d2a59f75'), 'perfume', ['office'], ['minimal', 'classic'], 'female', 'white', []),

  // ═══════════════════════════════════════════════════
  // FEMALE — CASUAL (Exclusive casual products)
  // ═══════════════════════════════════════════════════
  p('fc_top_1', 'White Linen Crop Top', 1990, img('1618932260643-eee4a2f652a6'), 'top', ['casual'], ['casual', 'minimal'], 'female', 'white', []),
  p('fc_top_2', 'Striped Oversized Tee', 1490, img('1583496661160-fb5886a0aaaa'), 'top', ['casual'], ['casual', 'streetwear'], 'female', 'multicolor', []),
  p('fc_top_3', 'Pastel Pink Hoodie', 2290, img('1617019114583-affb34d1b3cd'), 'top', ['casual'], ['casual'], 'female', 'pink', ['trending']),
  p('fc_top_4', 'Denim Jacket', 3290, img('1551028719-00167b16eac5'), 'top', ['casual'], ['casual', 'bold', 'streetwear'], 'female', 'blue', ['bestseller']),
  p('fc_top_5', 'Cream Knit Cardigan', 2790, img('1617019114583-affb34d1b3cd'), 'top', ['casual'], ['casual', 'minimal', 'bohemian'], 'female', 'cream', []),
  p('fc_top_6', 'Tie-Dye Tank Top', 1290, img('1564859227995-d0e8e5baf5b6'), 'top', ['casual'], ['casual', 'bold', 'trendy'], 'female', 'multicolor', ['new-arrival']),
  p('fc_top_7', 'Olive Utility Jacket', 3890, img('1551028719-00167b16eac5'), 'top', ['casual'], ['casual', 'streetwear'], 'female', 'olive', []),
  p('fc_top_8', 'Lavender Corduroy Shirt', 2590, img('1564859228273-274232fdb516'), 'top', ['casual'], ['casual', 'bohemian'], 'female', 'lavender', ['new-arrival']),

  // FEMALE — CASUAL DRESSES
  p('fc_dress_1', 'Floral Midi Sundress', 2990, img('1572804013427-4d7ca7268217'), 'dress', ['casual'], ['casual', 'romantic', 'bohemian'], 'female', 'multicolor', ['trending']),
  p('fc_dress_2', 'White Cotton Maxi Dress', 3490, img('1594552072238-b8a33785b261'), 'dress', ['casual'], ['casual', 'minimal', 'bohemian'], 'female', 'white', ['sustainable']),
  p('fc_dress_3', 'Denim Shirt Dress', 2790, img('1539008835657-9e8e9680c956'), 'dress', ['casual'], ['casual', 'streetwear'], 'female', 'blue', []),
  p('fc_dress_4', 'Mustard Boho Maxi', 3290, img('1572804013427-4d7ca7268217'), 'dress', ['casual'], ['casual', 'bohemian'], 'female', 'mustard', ['trending']),

  p('fc_bot_1', 'Light Wash Mom Jeans', 2490, img('1542272454315-7f6fabf542f7'), 'bottom', ['casual'], ['casual'], 'female', 'blue', ['bestseller']),
  p('fc_bot_2', 'Khaki Cargo Pants', 2590, img('1594633312681-425c7b97ccd1'), 'bottom', ['casual'], ['casual', 'streetwear'], 'female', 'khaki', ['trending']),
  p('fc_bot_3', 'Floral Midi Skirt', 2290, img('1560243563-062bfc001d68'), 'bottom', ['casual'], ['casual', 'elegant', 'romantic'], 'female', 'multicolor', []),
  p('fc_bot_4', 'Linen Drawstring Shorts', 1790, img('1594633312681-425c7b97ccd1'), 'bottom', ['casual'], ['casual'], 'female', 'beige', [], 'summer'),
  p('fc_bot_5', 'Black Jogger Pants', 1990, img('1624378439575-d8705ad7ae80'), 'bottom', ['casual'], ['casual', 'sporty'], 'female', 'black', []),
  p('fc_bot_6', 'Corduroy Mini Skirt', 1890, img('1583496661160-fb5886a0aaaa'), 'bottom', ['casual'], ['casual', 'trendy'], 'female', 'brown', ['new-arrival']),

  p('fc_sho_1', 'White Canvas Sneakers', 2890, img('1549298916-b41d501d3772'), 'shoes', ['casual'], ['casual', 'minimal'], 'female', 'white', ['bestseller']),
  p('fc_sho_2', 'Tan Leather Sandals', 2290, img('1543163521-1bf539c55dd2'), 'shoes', ['casual'], ['casual', 'bohemian'], 'female', 'tan', []),
  p('fc_sho_3', 'Pink Slip-On Flats', 1990, img('1562183241-b937e95585b6'), 'shoes', ['casual'], ['casual'], 'female', 'pink', []),
  p('fc_sho_4', 'Brown Ankle Boots', 3490, img('1549298916-b41d501d3772'), 'shoes', ['casual'], ['casual', 'bohemian'], 'female', 'brown', []),
  p('fc_sho_5', 'Platform Canvas Sneakers', 3190, img('1549298916-b41d501d3772'), 'shoes', ['casual'], ['casual', 'trendy', 'streetwear'], 'female', 'multicolor', ['trending']),

  p('fc_acc_1', 'Woven Straw Bag', 1890, img('1584917865442-de89df76afd3'), 'bag', ['casual'], ['casual', 'bohemian'], 'female', 'natural', [], 'summer'),
  p('fc_acc_2', 'Sunglasses (Cat Eye)', 2490, img('1511499767150-a48a237f0083'), 'accessory', ['casual'], ['casual', 'bold', 'trendy'], 'female', 'black', ['trending']),
  p('fc_acc_3', 'Beaded Friendship Bracelet', 890, img('1611591437281-460bfbe1220a'), 'accessory', ['casual'], ['casual', 'bohemian'], 'female', 'multicolor', []),
  p('fc_acc_4', 'Canvas Tote Bag', 1490, img('1584917865442-de89df76afd3'), 'bag', ['casual'], ['casual'], 'female', 'natural', ['sustainable']),

  // FEMALE — CASUAL PERFUMES
  p('fc_perf_1', 'Cherry Blossom Body Mist', 1990, img('1588405748880-12d1d2a59f75'), 'perfume', ['casual'], ['casual', 'romantic'], 'female', 'pink', []),
  p('fc_perf_2', 'Peony & Blush Suede', 4590, img('1594035910387-fea081e00a7e'), 'perfume', ['casual'], ['romantic', 'elegant'], 'female', 'pink', ['trending']),
  p('fc_perf_3', 'Coconut Vanilla Mist', 1490, img('1588405748880-12d1d2a59f75'), 'perfume', ['casual'], ['casual', 'bohemian'], 'female', 'cream', [], 'summer'),

  // ═══════════════════════════════════════════════════
  // FEMALE — DATE NIGHT (Exclusive)
  // ═══════════════════════════════════════════════════
  p('fd_top_1', 'Black Off-Shoulder Top', 2990, img('1581338834647-b0fb40704e21'), 'top', ['date'], ['elegant', 'bold', 'romantic'], 'female', 'black', ['trending']),
  p('fd_top_2', 'Wine Red Wrap Blouse', 3290, img('1562157873-818bc0726f68'), 'top', ['date'], ['elegant', 'romantic'], 'female', 'wine', []),
  p('fd_top_3', 'Lace Detail Camisole', 2690, img('1564859227995-d0e8e5baf5b6'), 'top', ['date'], ['elegant', 'bold', 'romantic'], 'female', 'blush', []),
  p('fd_top_4', 'Satin Burgundy Blouse', 3490, img('1595777457583-95e059d581b8'), 'top', ['date'], ['elegant', 'romantic'], 'female', 'burgundy', ['new-arrival']),

  // FEMALE — DATE DRESSES
  p('fd_dress_1', 'Silk Midi Dress (Wine)', 5990, img('1539008835657-9e8e9680c956'), 'dress', ['date'], ['elegant', 'romantic'], 'female', 'wine', ['trending', 'bestseller']),
  p('fd_dress_2', 'Black Wrap Dress', 4490, img('1566174053879-31528523f8ae'), 'dress', ['date'], ['elegant', 'minimal'], 'female', 'black', []),
  p('fd_dress_3', 'Emerald Satin Slip Dress', 4990, img('1572804013427-4d7ca7268217'), 'dress', ['date'], ['elegant', 'bold'], 'female', 'emerald', ['new-arrival']),

  p('fd_bot_1', 'Black Satin Midi Skirt', 3190, img('1583496661160-fb5886a0aaaa'), 'bottom', ['date'], ['elegant', 'romantic'], 'female', 'black', []),
  p('fd_bot_2', 'High-Waist Pleated Skirt', 2890, img('1560243563-062bfc001d68'), 'bottom', ['date'], ['elegant', 'romantic'], 'female', 'blush', []),

  p('fd_sho_1', 'Nude Ankle Strap Heels', 3990, img('1562183241-b937e95585b6'), 'shoes', ['date'], ['elegant', 'romantic'], 'female', 'nude', []),
  p('fd_sho_2', 'Black Pointed Mules', 3490, img('1596702656356-baec4feee61a'), 'shoes', ['date'], ['elegant', 'minimal'], 'female', 'black', []),

  p('fd_acc_1', 'Delicate Gold Pendant', 2290, img('1599643478518-a784e5dc4c8f'), 'accessory', ['date'], ['elegant', 'minimal', 'romantic'], 'female', 'gold', []),
  p('fd_acc_2', 'Mini Evening Bag', 2490, img('1566150905458-1bf1fc113f0d'), 'bag', ['date'], ['elegant', 'romantic'], 'female', 'black', []),

  // FEMALE — DATE PERFUMES
  p('fd_perf_1', 'Velvet Rose & Oud Night', 7990, img('1541643600914-78b084683601'), 'perfume', ['date'], ['elegant', 'romantic', 'bold'], 'female', 'rose', ['luxury']),
  p('fd_perf_2', 'Moonlight Gardenia EDP', 5490, img('1594035910387-fea081e00a7e'), 'perfume', ['date'], ['romantic', 'elegant'], 'female', 'white', ['trending']),

  // ═══════════════════════════════════════════════════
  // FEMALE — BRUNCH (Exclusive)
  // ═══════════════════════════════════════════════════
  p('fb_top_1', 'Linen Button-Up Shirt', 2290, img('1617019114583-affb34d1b3cd'), 'top', ['brunch'], ['casual', 'minimal'], 'female', 'white', []),
  p('fb_top_2', 'Pastel Wrap Top', 2490, img('1595777457583-95e059d581b8'), 'top', ['brunch'], ['casual', 'elegant'], 'female', 'lavender', ['new-arrival']),
  p('fb_dress_1', 'Gingham Check Dress', 2990, img('1572804013427-4d7ca7268217'), 'dress', ['brunch'], ['casual', 'romantic'], 'female', 'white', []),
  p('fb_dress_2', 'Lemon Print Midi Dress', 3490, img('1594552072238-b8a33785b261'), 'dress', ['brunch'], ['casual', 'bohemian'], 'female', 'yellow', ['trending'], 'summer'),
  p('fb_perf_1', 'Citrus Garden Body Splash', 1590, img('1588405748880-12d1d2a59f75'), 'perfume', ['brunch'], ['casual'], 'female', 'yellow', []),

  // ═══════════════════════════════════════════════════
  // FEMALE — TRAVEL (Exclusive)
  // ═══════════════════════════════════════════════════
  p('ft_top_1', 'Lightweight Windbreaker', 3490, img('1551028719-00167b16eac5'), 'top', ['travel'], ['casual', 'sporty'], 'female', 'navy', []),
  p('ft_top_2', 'Modal Relaxed Tee', 1590, img('1618932260643-eee4a2f652a6'), 'top', ['travel'], ['casual', 'minimal'], 'female', 'grey', []),
  p('ft_dress_1', 'Wrinkle-Free Travel Dress', 3290, img('1539008835657-9e8e9680c956'), 'dress', ['travel'], ['casual', 'minimal'], 'female', 'navy', ['sustainable']),
  p('ft_bag_1', 'Boho Fringe Tote', 3490, img('1584917865442-de89df76afd3'), 'bag', ['travel'], ['casual', 'bohemian'], 'female', 'brown', ['sustainable']),
  p('ft_bag_2', 'Compact Travel Crossbody', 2490, img('1566150905458-1bf1fc113f0d'), 'bag', ['travel'], ['casual', 'minimal'], 'female', 'tan', []),
  p('ft_perf_1', 'Fig & Bergamot EDT', 4990, img('1588405748880-12d1d2a59f75'), 'perfume', ['travel'], ['casual', 'bohemian'], 'unisex', 'green', ['sustainable']),

  // ═══════════════════════════════════════════════════
  // FEMALE — GYM / SPORTY (Exclusive)
  // ═══════════════════════════════════════════════════
  p('fg_top_1', 'Sports Bra (High Impact)', 1890, img('1564859227995-d0e8e5baf5b6'), 'top', ['gym'], ['sporty'], 'female', 'black', []),
  p('fg_top_2', 'Mesh Panel Tank Top', 1490, img('1618932260643-eee4a2f652a6'), 'top', ['gym'], ['sporty'], 'female', 'grey', []),
  p('fg_top_3', 'Quick-Dry Training Tee', 1690, img('1564859228273-274232fdb516'), 'top', ['gym'], ['sporty', 'casual'], 'female', 'pink', ['new-arrival']),
  p('fg_bot_1', 'High-Waist Leggings (Black)', 2290, img('1594633312681-425c7b97ccd1'), 'bottom', ['gym'], ['sporty'], 'female', 'black', ['bestseller']),
  p('fg_bot_2', 'Running Shorts', 1590, img('1594633312681-425c7b97ccd1'), 'bottom', ['gym'], ['sporty'], 'female', 'navy', []),
  p('fg_bot_3', 'Compression Tights', 2490, img('1624378439575-d8705ad7ae80'), 'bottom', ['gym'], ['sporty'], 'female', 'black', ['trending']),
  p('fg_sho_1', 'Lightweight Running Shoes', 4990, img('1549298916-b41d501d3772'), 'shoes', ['gym'], ['sporty'], 'female', 'pink', ['trending']),
  p('fg_sho_2', 'Cross Training Shoes', 3990, img('1549298916-b41d501d3772'), 'shoes', ['gym'], ['sporty'], 'female', 'white', []),
  p('fg_perf_1', 'Fresh Mint Sport Mist', 1290, img('1588405748880-12d1d2a59f75'), 'perfume', ['gym'], ['sporty', 'casual'], 'female', 'green', []),
  p('fg_bag_1', 'Gym Duffle Bag', 2490, img('1584917865442-de89df76afd3'), 'bag', ['gym'], ['sporty'], 'female', 'black', []),
  p('fg_watch_1', 'Fitness Tracker Watch', 4990, img('1523170335258-f5ed11844a49'), 'watch', ['gym'], ['sporty', 'casual'], 'female', 'black', ['trending']),

  // ═══════════════════════════════════════════════════
  // FEMALE — FESTIVE (Exclusive)
  // ═══════════════════════════════════════════════════
  p('ff_dress_1', 'Emerald Anarkali Suit', 12990, img('1583391733956-6c78276477e9'), 'dress', ['festive'], ['bold', 'elegant'], 'female', 'emerald', ['handcrafted', 'bestseller']),
  p('ff_dress_2', 'Magenta Silk Saree', 9990, img('1610030469983-98e550d6193c'), 'dress', ['festive'], ['bold', 'elegant'], 'female', 'magenta', ['handcrafted']),
  p('ff_dress_3', 'Turquoise Mirror Work Kurta', 6990, img('1583391733956-6c78276477e9'), 'dress', ['festive'], ['bold', 'bohemian'], 'female', 'turquoise', ['handcrafted']),
  p('ff_acc_1', 'Gold Jhumka Earrings', 4990, img('1535556116002-6281ff3e9f36'), 'accessory', ['festive'], ['bold', 'elegant'], 'female', 'gold', ['handcrafted', 'trending']),
  p('ff_acc_2', 'Silk Thread Bangles Set', 1890, img('1611591437281-460bfbe1220a'), 'accessory', ['festive'], ['bold', 'bohemian'], 'female', 'multicolor', ['handcrafted']),
  p('ff_perf_1', 'Saffron & Sandalwood EDP', 6990, img('1541643600914-78b084683601'), 'perfume', ['festive'], ['bold', 'elegant'], 'female', 'gold', ['luxury']),
  p('ff_sho_1', 'Embellished Juttis', 2990, img('1562183241-b937e95585b6'), 'shoes', ['festive'], ['bold', 'bohemian'], 'female', 'gold', ['handcrafted']),

  // ═══════════════════════════════════════════════════
  // MALE — WEDDING (Exclusive)
  // ═══════════════════════════════════════════════════
  p('mw_top_1', 'Black Tuxedo Blazer', 8990, img('1507679799987-c73779587ccf'), 'top', ['wedding'], ['elegant', 'classic'], 'male', 'black', ['bestseller']),
  p('mw_top_2', 'Ivory Sherwani Jacket', 7490, img('1620012253295-c15cc3e65df4'), 'top', ['wedding'], ['elegant', 'bold'], 'male', 'ivory', ['handcrafted']),
  p('mw_top_3', 'Navy Three-Piece Suit Jacket', 9590, img('1507679799987-c73779587ccf'), 'top', ['wedding'], ['elegant', 'classic'], 'male', 'navy', ['luxury']),
  p('mw_top_4', 'Maroon Bandhgala', 6990, img('1596755094514-f87e34085b2c'), 'top', ['wedding'], ['bold', 'elegant'], 'male', 'maroon', ['handcrafted']),
  p('mw_top_5', 'White Dress Shirt (Wing Collar)', 3290, img('1603252109303-2751441dd157'), 'top', ['wedding'], ['elegant', 'minimal', 'classic'], 'male', 'white', []),
  p('mw_top_6', 'Gold Brocade Waistcoat', 5490, img('1620012253295-c15cc3e65df4'), 'top', ['wedding'], ['bold'], 'male', 'gold', ['handcrafted']),

  p('mw_bot_1', 'Black Tuxedo Trousers', 4590, img('1624378439575-d8705ad7ae80'), 'bottom', ['wedding'], ['elegant', 'classic'], 'male', 'black', []),
  p('mw_bot_2', 'Cream Silk Churidar', 3890, img('1473966968600-fa801b869a1a'), 'bottom', ['wedding'], ['elegant', 'bold'], 'male', 'cream', ['handcrafted']),
  p('mw_bot_3', 'Navy Dress Pants', 3990, img('1624378439575-d8705ad7ae80'), 'bottom', ['wedding'], ['elegant', 'classic'], 'male', 'navy', []),
  p('mw_bot_4', 'Charcoal Suit Trousers', 4290, img('1506629082955-511b1aa562c8'), 'bottom', ['wedding'], ['elegant', 'minimal', 'classic'], 'male', 'charcoal', []),

  p('mw_sho_1', 'Patent Black Oxfords', 6290, img('1533867617858-e7b97e060509'), 'shoes', ['wedding'], ['elegant', 'classic'], 'male', 'black', ['bestseller']),
  p('mw_sho_2', 'Gold Mojari Shoes', 4890, img('1614252369475-531eba835eb1'), 'shoes', ['wedding'], ['bold', 'elegant'], 'male', 'gold', ['handcrafted']),
  p('mw_sho_3', 'Brown Double Monk Straps', 5890, img('1582897085656-c636d006a246'), 'shoes', ['wedding'], ['elegant', 'classic'], 'male', 'brown', []),
  p('mw_sho_4', 'Burgundy Brogues', 5190, img('1533867617858-e7b97e060509'), 'shoes', ['wedding'], ['bold'], 'male', 'burgundy', ['trending']),

  p('mw_acc_1', 'Gold Cufflinks Set', 3490, img('1617038260897-41a1f14a8ca0'), 'accessory', ['wedding'], ['bold', 'elegant'], 'male', 'gold', []),
  p('mw_acc_2', 'Silk Pocket Square', 1890, img('1602810319428-019690571b5b'), 'accessory', ['wedding'], ['elegant', 'classic'], 'male', 'multicolor', []),
  p('mw_acc_3', 'Diamond Brooch Pin', 5990, img('1617038260897-41a1f14a8ca0'), 'accessory', ['wedding'], ['bold', 'elegant'], 'male', 'silver', ['luxury']),
  p('mw_acc_4', 'Luxury Gold Watch', 15990, img('1523170335258-f5ed11844a49'), 'watch', ['wedding'], ['bold', 'elegant', 'classic'], 'male', 'gold', ['luxury', 'bestseller']),
  p('mw_acc_5', 'Safa/Turban (Wedding)', 4290, img('1602810319428-019690571b5b'), 'accessory', ['wedding'], ['bold'], 'male', 'gold', ['handcrafted']),

  // MALE — WEDDING PERFUMES
  p('mw_perf_1', 'Sandalwood Royale', 9490, img('1541643600914-78b084683601'), 'perfume', ['wedding'], ['elegant', 'classic'], 'male', 'gold', ['limited-edition', 'luxury']),
  p('mw_perf_2', 'Royal Oud Attar', 11990, img('1592945403244-b40fafb8ae0d'), 'perfume', ['wedding'], ['bold', 'elegant'], 'male', 'brown', ['luxury', 'handcrafted']),

  // ═══════════════════════════════════════════════════
  // MALE — PARTY (Exclusive)
  // ═══════════════════════════════════════════════════
  p('mp_top_1', 'Black Leather Jacket', 5990, img('1551028719-00167b16eac5'), 'top', ['party'], ['bold', 'streetwear'], 'male', 'black', ['bestseller']),
  p('mp_top_2', 'Burgundy Velvet Blazer', 6490, img('1596755094514-f87e34085b2c'), 'top', ['party'], ['bold', 'elegant'], 'male', 'burgundy', ['trending']),
  p('mp_top_3', 'Black Printed Shirt', 2890, img('1603252109303-2751441dd157'), 'top', ['party'], ['bold', 'trendy'], 'male', 'black', ['new-arrival']),
  p('mp_top_4', 'Satin Navy Shirt', 3290, img('1602810318660-d9f5a796d818'), 'top', ['party'], ['bold', 'elegant'], 'male', 'navy', []),
  p('mp_top_5', 'Metallic Grey T-Shirt', 1990, img('1521572163474-6864f9cf17ab'), 'top', ['party'], ['bold', 'casual', 'trendy'], 'male', 'grey', ['new-arrival']),

  p('mp_bot_1', 'Black Slim Fit Jeans', 2990, img('1542272454315-7f6fabf542f7'), 'bottom', ['party'], ['bold', 'casual'], 'male', 'black', []),
  p('mp_bot_2', 'Charcoal Chinos', 3290, img('1473966968600-fa801b869a1a'), 'bottom', ['party'], ['bold', 'minimal'], 'male', 'charcoal', []),
  p('mp_bot_3', 'Navy Dress Pants', 3890, img('1624378439575-d8705ad7ae80'), 'bottom', ['party'], ['bold', 'elegant'], 'male', 'navy', []),
  p('mp_bot_4', 'Black Leather Pants', 5290, img('1624378439575-d8705ad7ae80'), 'bottom', ['party'], ['bold', 'trendy'], 'male', 'black', ['trending']),

  p('mp_sho_1', 'Black Chelsea Boots', 5690, img('1608256246200-53e635b5b65f'), 'shoes', ['party'], ['bold'], 'male', 'black', ['bestseller']),
  p('mp_sho_2', 'White High-Top Sneakers', 3990, img('1549298916-b41d501d3772'), 'shoes', ['party'], ['bold', 'casual', 'streetwear'], 'male', 'white', ['trending']),
  p('mp_sho_3', 'Suede Loafers', 4590, img('1560343090-f0409e92791a'), 'shoes', ['party'], ['bold', 'elegant'], 'male', 'tan', []),

  p('mp_acc_1', 'Silver Chain Necklace', 3290, img('1599643478518-a784e5dc4c8f'), 'accessory', ['party'], ['bold', 'streetwear'], 'male', 'silver', ['trending']),
  p('mp_acc_2', 'Aviator Sunglasses', 2890, img('1511499767150-a48a237f0083'), 'accessory', ['party'], ['bold', 'casual', 'classic'], 'male', 'gold', []),
  p('mp_acc_3', 'Black Leather Bracelet', 1290, img('1611591437281-460bfbe1220a'), 'accessory', ['party'], ['bold', 'streetwear'], 'male', 'black', []),

  // MALE — PARTY PERFUMES
  p('mp_perf_1', 'Midnight Vetiver EDP', 6290, img('1541643600914-78b084683601'), 'perfume', ['party'], ['bold'], 'male', 'black', ['trending']),
  p('mp_perf_2', 'Black Musk Intense', 5990, img('1594035910387-fea081e00a7e'), 'perfume', ['party'], ['bold', 'trendy'], 'male', 'black', ['trending']),

  // ═══════════════════════════════════════════════════
  // MALE — OFFICE (Exclusive)
  // ═══════════════════════════════════════════════════
  p('mo_top_1', 'White Oxford Shirt', 2490, img('1620012253295-c15cc3e65df4'), 'top', ['office'], ['minimal', 'classic'], 'male', 'white', []),
  p('mo_top_2', 'Light Blue Dress Shirt', 2690, img('1602810318660-d9f5a796d818'), 'top', ['office'], ['minimal', 'classic'], 'male', 'blue', []),
  p('mo_top_3', 'Charcoal Wool Blazer', 5990, img('1507679799987-c73779587ccf'), 'top', ['office'], ['minimal', 'elegant', 'classic'], 'male', 'charcoal', ['bestseller']),
  p('mo_top_4', 'Grey Turtleneck', 3490, img('1620799140408-edc6dcb6d633'), 'top', ['office'], ['minimal', 'elegant'], 'male', 'grey', []),
  p('mo_top_5', 'Pinstripe Dress Shirt', 2790, img('1603252109303-2751441dd157'), 'top', ['office'], ['minimal', 'classic'], 'male', 'white', []),
  p('mo_top_6', 'Beige Linen Blazer', 4990, img('1507679799987-c73779587ccf'), 'top', ['office'], ['minimal', 'elegant'], 'male', 'beige', ['trending']),

  p('mo_bot_1', 'Charcoal Dress Pants', 3690, img('1624378439575-d8705ad7ae80'), 'bottom', ['office'], ['minimal', 'elegant', 'classic'], 'male', 'charcoal', []),
  p('mo_bot_2', 'Navy Formal Trousers', 3490, img('1473966968600-fa801b869a1a'), 'bottom', ['office'], ['minimal', 'classic'], 'male', 'navy', []),
  p('mo_bot_3', 'Grey Pinstripe Pants', 4290, img('1624378439575-d8705ad7ae80'), 'bottom', ['office'], ['minimal', 'elegant', 'classic'], 'male', 'grey', []),
  p('mo_bot_4', 'Khaki Dress Chinos', 3290, img('1473966968600-fa801b869a1a'), 'bottom', ['office'], ['minimal'], 'male', 'khaki', []),

  p('mo_sho_1', 'Black Oxford Shoes', 5290, img('1533867617858-e7b97e060509'), 'shoes', ['office'], ['minimal', 'elegant', 'classic'], 'male', 'black', []),
  p('mo_sho_2', 'Brown Derby Shoes', 4890, img('1582897085656-c636d006a246'), 'shoes', ['office'], ['elegant', 'classic'], 'male', 'brown', []),
  p('mo_sho_3', 'Tan Leather Brogues', 4590, img('1614252369475-531eba835eb1'), 'shoes', ['office'], ['elegant', 'classic'], 'male', 'tan', []),
  p('mo_sho_4', 'Navy Leather Loafers', 4390, img('1560343090-f0409e92791a'), 'shoes', ['office'], ['minimal', 'classic'], 'male', 'navy', []),

  p('mo_acc_1', 'Leather Briefcase', 7490, img('1553062407-98eeb64c6a62'), 'bag', ['office'], ['minimal', 'elegant', 'classic'], 'male', 'brown', ['bestseller']),
  p('mo_acc_2', 'Silver Dress Watch', 8990, img('1523170335258-f5ed11844a49'), 'watch', ['office'], ['minimal', 'elegant', 'classic'], 'male', 'silver', ['bestseller']),
  p('mo_acc_3', 'Black Tie & Cufflinks', 2490, img('1603252109333-318c8b2e13c4'), 'accessory', ['office'], ['elegant', 'classic'], 'male', 'black', []),
  p('mo_acc_4', 'Leather Belt', 1890, img('1624222247344-550fb60583b2'), 'accessory', ['office'], ['minimal', 'classic'], 'male', 'brown', []),

  // MALE — OFFICE PERFUMES
  p('mo_perf_1', 'Velour Oud Wood Cologne', 7990, img('1594035910387-fea081e00a7e'), 'perfume', ['office'], ['elegant', 'bold', 'classic'], 'male', 'brown', ['bestseller', 'luxury']),
  p('mo_perf_2', 'Aqua Marine EDT', 3490, img('1588405748880-12d1d2a59f75'), 'perfume', ['office'], ['casual', 'minimal'], 'male', 'blue', ['new-arrival']),

  // ═══════════════════════════════════════════════════
  // MALE — CASUAL (Exclusive)
  // ═══════════════════════════════════════════════════
  p('mc_top_1', 'Grey Crew Neck T-Shirt', 1490, img('1521572163474-6864f9cf17ab'), 'top', ['casual'], ['casual', 'sporty'], 'male', 'grey', []),
  p('mc_top_2', 'White Henley Shirt', 1790, img('1620012253295-c15cc3e65df4'), 'top', ['casual'], ['casual', 'minimal'], 'male', 'white', []),
  p('mc_top_3', 'Olive Green Bomber Jacket', 3990, img('1551028719-00167b16eac5'), 'top', ['casual'], ['casual', 'bold', 'streetwear'], 'male', 'olive', ['trending']),
  p('mc_top_4', 'Navy Polo Shirt', 1990, img('1521572163474-6864f9cf17ab'), 'top', ['casual'], ['casual', 'classic'], 'male', 'navy', []),
  p('mc_top_5', 'Flannel Check Shirt', 2290, img('1602810318660-d9f5a796d818'), 'top', ['casual'], ['casual'], 'male', 'red', []),
  p('mc_top_6', 'Cream Linen Shirt', 2490, img('1620012253295-c15cc3e65df4'), 'top', ['casual'], ['casual', 'minimal', 'bohemian'], 'male', 'cream', ['sustainable']),

  p('mc_bot_1', 'Blue Denim Jeans', 2790, img('1542272454315-7f6fabf542f7'), 'bottom', ['casual'], ['casual'], 'male', 'blue', ['bestseller']),
  p('mc_bot_2', 'Olive Cargo Pants', 2590, img('1506629082955-511b1aa562c8'), 'bottom', ['casual'], ['casual', 'streetwear'], 'male', 'olive', ['trending']),
  p('mc_bot_3', 'Beige Chinos', 2990, img('1473966968600-fa801b869a1a'), 'bottom', ['casual'], ['casual', 'minimal', 'classic'], 'male', 'beige', []),
  p('mc_bot_4', 'Grey Joggers', 1790, img('1473966968600-fa801b869a1a'), 'bottom', ['casual'], ['casual', 'sporty'], 'male', 'grey', []),
  p('mc_bot_5', 'Khaki Shorts', 1590, img('1506629082955-511b1aa562c8'), 'bottom', ['casual'], ['casual'], 'male', 'khaki', [], 'summer'),

  p('mc_sho_1', 'White Stan Smith Sneakers', 3290, img('1549298916-b41d501d3772'), 'shoes', ['casual'], ['casual', 'minimal'], 'male', 'white', ['bestseller']),
  p('mc_sho_2', 'Brown Leather Sandals', 2490, img('1560343090-f0409e92791a'), 'shoes', ['casual'], ['casual'], 'male', 'brown', []),
  p('mc_sho_3', 'Black Running Shoes', 3490, img('1549298916-b41d501d3772'), 'shoes', ['casual'], ['casual', 'sporty'], 'male', 'black', ['trending']),
  p('mc_sho_4', 'Canvas Slip-Ons', 1890, img('1549298916-b41d501d3772'), 'shoes', ['casual'], ['casual'], 'male', 'beige', []),

  p('mc_acc_1', 'Leather Crossbody Bag', 3290, img('1553062407-98eeb64c6a62'), 'bag', ['casual'], ['casual'], 'male', 'brown', []),
  p('mc_acc_2', 'Polarized Sunglasses', 2890, img('1511499767150-a48a237f0083'), 'accessory', ['casual'], ['casual', 'bold'], 'male', 'black', []),
  p('mc_acc_3', 'Canvas Backpack', 2490, img('1553062407-98eeb64c6a62'), 'bag', ['casual'], ['casual', 'streetwear'], 'male', 'grey', ['sustainable']),
  p('mc_acc_4', 'Sports Watch', 4990, img('1523170335258-f5ed11844a49'), 'watch', ['casual'], ['casual', 'sporty', 'minimal'], 'male', 'black', []),

  // MALE — CASUAL PERFUMES
  p('mc_perf_1', 'Fresh Citrus Sport', 2990, img('1588405748880-12d1d2a59f75'), 'perfume', ['casual'], ['casual', 'sporty'], 'male', 'green', []),
  p('mc_perf_2', 'Ocean Breeze Body Spray', 1490, img('1588405748880-12d1d2a59f75'), 'perfume', ['casual'], ['casual'], 'male', 'blue', []),

  // ═══════════════════════════════════════════════════
  // MALE — DATE NIGHT (Exclusive)
  // ═══════════════════════════════════════════════════
  p('md_top_1', 'Navy Slim Fit Blazer', 5990, img('1507679799987-c73779587ccf'), 'top', ['date'], ['elegant', 'classic'], 'male', 'navy', []),
  p('md_top_2', 'Black Mandarin Collar Shirt', 3290, img('1603252109303-2751441dd157'), 'top', ['date'], ['elegant', 'bold'], 'male', 'black', ['trending']),
  p('md_top_3', 'Cream Roll-Neck Sweater', 3490, img('1620799140408-edc6dcb6d633'), 'top', ['date'], ['elegant', 'minimal'], 'male', 'cream', []),

  p('md_bot_1', 'Slim Dark Navy Chinos', 3490, img('1473966968600-fa801b869a1a'), 'bottom', ['date'], ['elegant', 'minimal', 'classic'], 'male', 'navy', []),
  p('md_bot_2', 'Black Tailored Pants', 3890, img('1624378439575-d8705ad7ae80'), 'bottom', ['date'], ['elegant', 'classic'], 'male', 'black', []),

  p('md_sho_1', 'Suede Desert Boots', 4290, img('1608256246200-53e635b5b65f'), 'shoes', ['date'], ['elegant', 'casual'], 'male', 'tan', []),
  p('md_sho_2', 'Brown Leather Loafers', 4590, img('1560343090-f0409e92791a'), 'shoes', ['date'], ['elegant', 'classic'], 'male', 'brown', []),

  p('md_acc_1', 'Leather Card Wallet', 1890, img('1624222247344-550fb60583b2'), 'accessory', ['date'], ['elegant', 'minimal', 'classic'], 'male', 'brown', []),

  // MALE — DATE PERFUMES
  p('md_perf_1', 'Leather & Tobacco EDP', 8490, img('1592945403244-b40fafb8ae0d'), 'perfume', ['date'], ['bold', 'classic'], 'male', 'brown', ['luxury']),
  p('md_perf_2', 'Noir Intense Cologne', 6990, img('1541643600914-78b084683601'), 'perfume', ['date'], ['bold', 'elegant'], 'male', 'black', ['trending']),

  // ═══════════════════════════════════════════════════
  // MALE — GYM (Exclusive)
  // ═══════════════════════════════════════════════════
  p('mg_top_1', 'Dri-Fit Training Tee', 1490, img('1521572163474-6864f9cf17ab'), 'top', ['gym'], ['sporty', 'casual'], 'male', 'black', []),
  p('mg_top_2', 'Compression Tank Top', 1790, img('1521572163474-6864f9cf17ab'), 'top', ['gym'], ['sporty'], 'male', 'grey', []),
  p('mg_bot_1', 'Athletic Shorts', 1390, img('1506629082955-511b1aa562c8'), 'bottom', ['gym'], ['sporty'], 'male', 'black', []),
  p('mg_bot_2', 'Training Joggers', 2190, img('1473966968600-fa801b869a1a'), 'bottom', ['gym'], ['sporty', 'casual'], 'male', 'navy', []),
  p('mg_sho_1', 'Cross Training Shoes', 4490, img('1549298916-b41d501d3772'), 'shoes', ['gym'], ['sporty'], 'male', 'black', []),
  p('mg_perf_1', 'Ice Cool Post-Workout Spray', 1290, img('1588405748880-12d1d2a59f75'), 'perfume', ['gym'], ['sporty'], 'male', 'blue', []),
  p('mg_bag_1', 'Gym Duffle (Waterproof)', 3490, img('1553062407-98eeb64c6a62'), 'bag', ['gym'], ['sporty'], 'male', 'black', ['trending']),
  p('mg_watch_1', 'G-Shock Tactical Watch', 5990, img('1523170335258-f5ed11844a49'), 'watch', ['gym'], ['sporty', 'bold'], 'male', 'black', ['bestseller']),

  // MALE — TRAVEL (Exclusive)
  p('mt_top_1', 'Windproof Travel Jacket', 4490, img('1551028719-00167b16eac5'), 'top', ['travel'], ['casual', 'sporty'], 'male', 'navy', []),
  p('mt_bag_1', 'Weekend Duffle Bag', 4990, img('1553062407-98eeb64c6a62'), 'bag', ['travel'], ['casual', 'classic'], 'male', 'navy', ['trending']),
  p('mt_bag_2', 'Urban Backpack (Leather)', 4490, img('1553062407-98eeb64c6a62'), 'bag', ['travel'], ['casual', 'streetwear'], 'male', 'black', []),
  p('mt_perf_1', 'Driftwood & Sea Salt EDT', 4990, img('1588405748880-12d1d2a59f75'), 'perfume', ['travel'], ['casual', 'bohemian'], 'male', 'blue', []),

  // MALE — FESTIVE (Exclusive)
  p('mf_top_1', 'Kurta Pajama Set Top', 4990, img('1620012253295-c15cc3e65df4'), 'top', ['festive'], ['elegant', 'bohemian'], 'male', 'white', ['handcrafted']),
  p('mf_top_2', 'Nehru Jacket (Navy)', 5490, img('1596755094514-f87e34085b2c'), 'top', ['festive'], ['elegant', 'classic'], 'male', 'navy', ['trending']),
  p('mf_top_3', 'Silk Pathani Suit', 6990, img('1620012253295-c15cc3e65df4'), 'top', ['festive'], ['elegant', 'bold'], 'male', 'cream', ['handcrafted']),
  p('mf_perf_1', 'Oudh & Saffron Attar', 7990, img('1541643600914-78b084683601'), 'perfume', ['festive'], ['bold', 'elegant'], 'male', 'gold', ['luxury', 'handcrafted']),
  p('mf_sho_1', 'Embroidered Mojari', 3490, img('1614252369475-531eba835eb1'), 'shoes', ['festive'], ['bold', 'elegant'], 'male', 'gold', ['handcrafted']),

  // ═══════════════════════════════════════════════════════════════
  // WATCHES — Dedicated Category (additional)
  // ═══════════════════════════════════════════════════════════════
  p('wt_f_2', 'Petite Silver Bracelet Watch', 6990, img('1523170335258-f5ed11844a49'), 'watch', ['office', 'casual'], ['minimal', 'elegant'], 'female', 'silver', []),
  p('wt_f_3', 'Gold Mesh Strap Watch', 8490, img('1523170335258-f5ed11844a49'), 'watch', ['party', 'brunch'], ['elegant', 'trendy'], 'female', 'gold', ['trending']),
  p('wt_f_4', 'Ceramic White Dial Watch', 7290, img('1523170335258-f5ed11844a49'), 'watch', ['office', 'casual'], ['minimal', 'classic'], 'female', 'white', ['new-arrival']),
  p('wt_m_1', 'Automatic Skeleton Watch', 22990, img('1523170335258-f5ed11844a49'), 'watch', ['party', 'date'], ['bold', 'elegant'], 'male', 'silver', ['luxury', 'trending']),
  p('wt_m_2', 'Pilot Chronograph', 15990, img('1523170335258-f5ed11844a49'), 'watch', ['casual', 'travel'], ['bold', 'classic', 'sporty'], 'male', 'brown', ['bestseller']),
  p('wt_m_3', 'Dive Watch (200m)', 11990, img('1523170335258-f5ed11844a49'), 'watch', ['casual', 'travel'], ['bold', 'sporty'], 'male', 'blue', []),
  p('wt_m_4', 'Minimalist Black Dial Watch', 7490, img('1523170335258-f5ed11844a49'), 'watch', ['office', 'casual'], ['minimal', 'elegant'], 'male', 'black', ['trending']),

  // ═══════════════════════════════════════════════════════════════
  // BAGS — Additional
  // ═══════════════════════════════════════════════════════════════
  p('bg_f_1', 'Quilted Chain Shoulder Bag', 8990, img('1566150905458-1bf1fc113f0d'), 'bag', ['party', 'date'], ['elegant', 'classic'], 'female', 'black', ['bestseller']),
  p('bg_f_2', 'Mini Crossbody (Gold Chain)', 5490, img('1584917865442-de89df76afd3'), 'bag', ['party', 'casual'], ['bold', 'trendy'], 'female', 'nude', ['trending']),
  p('bg_f_3', 'Structured Work Tote', 6990, img('1584917865442-de89df76afd3'), 'bag', ['office'], ['minimal', 'classic'], 'female', 'tan', ['bestseller']),
  p('bg_f_4', 'Embellished Clutch', 4290, img('1566150905458-1bf1fc113f0d'), 'bag', ['wedding'], ['elegant', 'bold'], 'female', 'gold', ['handcrafted']),
  p('bg_f_5', 'Satin Evening Pouch', 3990, img('1566150905458-1bf1fc113f0d'), 'bag', ['date', 'party'], ['elegant', 'romantic'], 'female', 'champagne', []),
  p('bg_m_1', 'Leather Messenger Bag', 5490, img('1553062407-98eeb64c6a62'), 'bag', ['office'], ['minimal', 'classic'], 'male', 'brown', ['bestseller']),
  p('bg_m_2', 'Slim Laptop Sleeve', 2990, img('1553062407-98eeb64c6a62'), 'bag', ['office'], ['minimal'], 'male', 'black', []),

  // ═══════════════════════════════════════════════════════════════
  // UNISEX PERFUMES (cross-occasion)
  // ═══════════════════════════════════════════════════════════════
  p('pf_u_1', 'Santal 33 Eau de Parfum', 11990, img('1592945403244-b40fafb8ae0d'), 'perfume', ['office', 'date'], ['minimal', 'elegant'], 'unisex', 'natural', ['bestseller', 'luxury']),
  p('pf_u_2', 'Velour No. 5 Signature', 14990, img('1541643600914-78b084683601'), 'perfume', ['wedding', 'party'], ['elegant', 'bold'], 'unisex', 'gold', ['luxury', 'limited-edition']),
  p('pf_u_3', 'Cedar & Sage Artisan', 6490, img('1592945403244-b40fafb8ae0d'), 'perfume', ['casual', 'brunch'], ['minimal', 'bohemian'], 'unisex', 'green', ['sustainable', 'handcrafted']),
  p('pf_u_4', 'Vanilla Noir Absolute', 8990, img('1541643600914-78b084683601'), 'perfume', ['date', 'party'], ['bold', 'romantic'], 'unisex', 'brown', ['limited-edition']),

  // ═══════════════════════════════════════════════════════════════
  // SKINCARE — New Category
  // ═══════════════════════════════════════════════════════════════
  p('sk_f_1', 'Hydrating Rose Face Mist', 1290, img('1556228578-8c89e6adf883'), 'skincare', ['casual', 'office', 'travel'], ['minimal'], 'female', 'pink', ['trending']),
  p('sk_f_2', 'Vitamin C Glow Serum', 1990, img('1556228578-8c89e6adf883'), 'skincare', ['casual', 'office'], ['minimal', 'elegant'], 'female', 'gold', ['bestseller']),
  p('sk_f_3', 'Bridal Glow Kit', 4990, img('1556228578-8c89e6adf883'), 'skincare', ['wedding'], ['elegant'], 'female', 'gold', ['luxury']),
  p('sk_m_1', 'Charcoal Face Wash', 890, img('1556228578-8c89e6adf883'), 'skincare', ['casual', 'gym'], ['minimal'], 'male', 'black', ['bestseller']),
  p('sk_m_2', 'Anti-Aging Night Cream', 2490, img('1556228578-8c89e6adf883'), 'skincare', ['casual', 'office'], ['minimal', 'elegant'], 'male', 'white', ['trending']),
  p('sk_u_1', 'SPF 50 Sunscreen', 990, img('1556228578-8c89e6adf883'), 'skincare', ['casual', 'travel', 'gym'], ['minimal'], 'unisex', 'white', ['bestseller']),
  p('sk_u_2', 'Aloe Vera Soothing Gel', 690, img('1556228578-8c89e6adf883'), 'skincare', ['casual', 'gym', 'travel'], ['minimal', 'casual'], 'unisex', 'green', ['sustainable']),
];

// ═══════════════════════════════════════════════════════════════
// ENHANCED FILTERING — Supports all new categories & tags
// ═══════════════════════════════════════════════════════════════

// All searchable category types (for the UI and keyword detection)
export const ALL_CATEGORIES: Product['category'][] = ['top', 'bottom', 'shoes', 'accessory', 'perfume', 'bag', 'watch', 'dress', 'skincare'];

// Price range utility
export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: 'Under ₹1K', min: 0, max: 1000 },
  { label: '₹1K-₹2K', min: 1000, max: 2000 },
  { label: '₹2K-₹3K', min: 2000, max: 3000 },
  { label: '₹3K-₹5K', min: 3000, max: 5000 },
  { label: '₹5K-₹10K', min: 5000, max: 10000 },
  { label: '₹10K-₹15K', min: 10000, max: 15000 },
  { label: '₹15K-₹25K', min: 15000, max: 25000 },
  { label: 'Above ₹25K', min: 25000, max: Infinity },
];

export function getPriceRange(label: string): PriceRange | undefined {
  return PRICE_RANGES.find(r => r.label === label);
}

// ═══════════════════════════════════════════════════════════════
// RELEVANCE-SCORED FILTERING — Better permutation matching
// ═══════════════════════════════════════════════════════════════

// Score a product against search criteria — higher = more relevant
export function scoreProduct(
  product: Product,
  occasions: string[],
  styles: string[],
  tags: string[],
  colors: string[],
  category: Product['category'] | Product['category'][] | null,
): number {
  let score = 0;

  // Category match (hard filter usually, but adds score for ranking)
  if (category) {
    const categories = Array.isArray(category) ? category : [category];
    if (categories.includes(product.category)) score += 10;
  }

  // Occasion matches — each matching occasion adds points
  // Products with FEWER total occasions get a bonus (more specific = better)
  if (occasions.length > 0) {
    const matchCount = product.occasions.filter(o => occasions.includes(o)).length;
    score += matchCount * 8;
    // Specificity bonus: products tagged with fewer occasions are more relevant
    if (matchCount > 0 && product.occasions.length <= 2) score += 5;
    if (matchCount > 0 && product.occasions.length === 1) score += 3;
  }

  // Style matches
  if (styles.length > 0) {
    const matchCount = product.styles.filter(s => styles.includes(s)).length;
    score += matchCount * 5;
  }

  // Tag matches
  if (tags.length > 0) {
    const matchCount = product.tags?.filter(t => tags.includes(t)).length ?? 0;
    score += matchCount * 6;
  }

  // Color matches
  if (colors.length > 0) {
    if (product.color && colors.includes(product.color)) score += 7;
  }

  return score;
}

// Enhanced filtering with proper multi-field combination and relevance scoring
export function filterProducts(
  category: Product['category'] | Product['category'][] | null,
  occasions: string[],
  styles: string[],
  maxBudget: number,
  gender: 'female' | 'male' | 'unisex',
  excludeIds: string[] = [],
  options?: {
    minBudget?: number;
    tags?: string[];
    colors?: string[];
    sortByRelevance?: boolean;
  }
): Product[] {
  const categories = category
    ? (Array.isArray(category) ? category : [category])
    : null;
  const minBudget = options?.minBudget ?? 0;
  const tags = options?.tags ?? [];
  const colors = options?.colors ?? [];

  let results = productDatabase.filter(product => {
    // Category filter
    if (categories && !categories.includes(product.category)) return false;

    // Exclude IDs
    if (excludeIds.includes(product.id)) return false;

    // Gender filter
    if (product.gender !== gender && product.gender !== 'unisex') return false;

    // Price range filter — STRICT
    if (product.price > maxBudget) return false;
    if (product.price < minBudget) return false;

    // Occasion filter (any match)
    if (occasions.length > 0) {
      const matchesOccasion = product.occasions.some(occ => occasions.includes(occ));
      if (!matchesOccasion) return false;
    }

    // Style filter (any match)
    if (styles.length > 0) {
      const matchesStyle = product.styles.some(sty => styles.includes(sty));
      if (!matchesStyle) return false;
    }

    // Tag filter (any match)
    if (tags.length > 0) {
      const matchesTag = product.tags?.some(tag => tags.includes(tag)) ?? false;
      if (!matchesTag) return false;
    }

    // Color filter (any match)
    if (colors.length > 0) {
      if (!product.color || !colors.includes(product.color)) return false;
    }

    return true;
  });

  // Sort by relevance score if requested (default: true)
  if (options?.sortByRelevance !== false) {
    results.sort((a, b) => {
      const scoreA = scoreProduct(a, occasions, styles, tags, colors, category);
      const scoreB = scoreProduct(b, occasions, styles, tags, colors, category);
      return scoreB - scoreA; // Higher score first
    });
  }

  return results;
}

// Filter products across ALL categories (for mixed results)
export function filterProductsAllCategories(
  occasions: string[],
  styles: string[],
  maxBudget: number,
  gender: 'female' | 'male' | 'unisex',
  options?: {
    minBudget?: number;
    tags?: string[];
    colors?: string[];
  }
): Product[] {
  return filterProducts(null, occasions, styles, maxBudget, gender, [], options);
}

// Get trending products (tagged as trending)
export function getTrendingProducts(gender: 'female' | 'male' | 'unisex', limit = 8): Product[] {
  return productDatabase
    .filter(p =>
      (p.gender === gender || p.gender === 'unisex') &&
      p.tags?.includes('trending')
    )
    .slice(0, limit);
}

// Get new arrivals
export function getNewArrivals(gender: 'female' | 'male' | 'unisex', limit = 8): Product[] {
  return productDatabase
    .filter(p =>
      (p.gender === gender || p.gender === 'unisex') &&
      p.tags?.includes('new-arrival')
    )
    .slice(0, limit);
}

// Get bestsellers
export function getBestsellers(gender: 'female' | 'male' | 'unisex', limit = 8): Product[] {
  return productDatabase
    .filter(p =>
      (p.gender === gender || p.gender === 'unisex') &&
      p.tags?.includes('bestseller')
    )
    .slice(0, limit);
}

// Get luxury / premium products
export function getLuxuryProducts(gender: 'female' | 'male' | 'unisex', limit = 8): Product[] {
  return productDatabase
    .filter(p =>
      (p.gender === gender || p.gender === 'unisex') &&
      p.tags?.includes('luxury')
    )
    .slice(0, limit);
}

// Randomize array helper
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Enhanced outfit generation supporting new categories
export function generateOutfit(
  occasions: string[],
  styles: string[],
  budgetPerItem: number,
  gender: 'female' | 'male'
): {
  top: Product | null;
  bottom: Product | null;
  shoes: Product | null;
  accessory: Product | null;
  perfume: Product | null;
  bag: Product | null;
} {
  const usedIds: string[] = [];

  const findItem = (category: Product['category']): Product | null => {
    const items = shuffleArray(filterProducts(category, occasions, styles, budgetPerItem, gender, usedIds));
    const item = items[0] || null;
    if (item) usedIds.push(item.id);
    return item;
  };

  return {
    top: findItem('top'),
    bottom: findItem('bottom'),
    shoes: findItem('shoes'),
    accessory: findItem('accessory'),
    perfume: findItem('perfume'),
    bag: findItem('bag'),
  };
}

// Get unique products for a specific occasion (not shared with others)
export function getOccasionExclusiveProducts(
  occasion: string,
  gender: 'female' | 'male',
  limit = 6
): Product[] {
  return productDatabase
    .filter(p =>
      (p.gender === gender || p.gender === 'unisex') &&
      p.occasions.includes(occasion) &&
      p.occasions.length === 1 // Only tagged with this ONE occasion
    )
    .slice(0, limit);
}

// Get mixed product samples across categories for an occasion
export function getOccasionShowcase(
  occasion: string,
  gender: 'female' | 'male',
  limit = 8
): Product[] {
  const results: Product[] = [];
  const allCats: Product['category'][] = ['dress', 'top', 'bottom', 'shoes', 'accessory', 'perfume', 'bag', 'watch', 'skincare'];

  for (const cat of allCats) {
    if (results.length >= limit) break;
    const items = productDatabase.filter(p =>
      p.category === cat &&
      p.occasions.includes(occasion) &&
      (p.gender === gender || p.gender === 'unisex') &&
      !results.some(r => r.id === p.id)
    );
    // Prefer occasion-exclusive products first
    const exclusive = items.filter(i => i.occasions.length === 1);
    const pick = exclusive[0] || items[0];
    if (pick) results.push(pick);
  }

  return results;
}
