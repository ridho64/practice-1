// lib/data/landingData.js

export const landingData = {
  men: {
    heroImage: "https://image.pollinations.ai/prompt/neutral%20minimalist%20men%20fashion%20banner",
    banners: [
      {
        title: "Hoodies",
        image: "https://image.pollinations.ai/prompt/beige%20hoodie%20fashion%20flatlay",
        href: "/products?gender=men&category=clothing&subcategory=hoodies",
      },
      {
        title: "T-Shirts",
        image: "https://image.pollinations.ai/prompt/black%20tshirt%20minimalist%20flatlay",
        href: "/products?gender=men&category=clothing&subcategory=t-shirts",
      },
      {
        title: "Jackets",
        image: "https://image.pollinations.ai/prompt/denim%20jacket%20fashion%20flatlay",
        href: "/products?gender=men&category=clothing&subcategory=jackets",
      },
    ],
      suggested: [
        {
          id: 1,
          name: "Essential Beige Hoodie",
          price: 499000,
          excerpt: "Soft, breathable hoodie for everyday comfort.",
          thumbnail: "https://image.pollinations.ai/prompt/beige%20hoodie%20fashion%20flatlay",
          slug: "essential-beige-hoodie",
        },
        {
          id: 2,
          name: "Minimalist Black T-Shirt",
          price: 199000,
          excerpt: "Clean silhouette with premium cotton.",
          thumbnail: "https://image.pollinations.ai/prompt/black%20tshirt%20minimalist%20flatlay",
          slug: "minimalist-black-tshirt",
        },
        {
          id: 3,
          name: "Urban Denim Jacket",
          price: 799000,
          excerpt: "Timeless denim jacket for city life.",
          thumbnail: "https://image.pollinations.ai/prompt/denim%20jacket%20fashion%20flatlay",
          slug: "urban-denim-jacket",
        },
        {
            id: 4,
            name: "Lather jacket",
            price: 799000,
            excerpt: "Timeless Lather jacket for road life.",
            thumbnail: "https://image.pollinations.ai/prompt/lather%20jacket%20fashion%20flatlay",
            slug: "Lather-jacket",
        },
      ],
    },
  
    women: {
      heroImage: "https://image.pollinations.ai/prompt/minimalist%20fashion%20flatlay%20for%20women",
      banners: [
        {
          title: "Dresses",
          image: "https://image.pollinations.ai/prompt/classic%20white%20dress%20fashion",
          href: "/products?gender=women&category=clothing&subcategory=dresses",
        },
        {
          title: "Tops",
          image: "https://image.pollinations.ai/prompt/white%20blouse%20fashion%20minimalist",
          href: "/products?gender=women&category=clothing&subcategory=tops",
        },
        {
          title: "Heels",
          image: "https://image.pollinations.ai/prompt/minimalist%20nude%20heels",
          href: "/products?gender=women&category=shoes&subcategory=heels",
        },
      ],
      suggested: [
        {
          id: 5,
          name: "Classic White Dress",
          price: 699000,
          excerpt: "Elegant, simple and breathable.",
          thumbnail: "https://image.pollinations.ai/prompt/classic%20white%20dress%20fashion",
          slug: "classic-white-dress",
        },
        {
          id: 6,
          name: "Flowy Blouse",
          price: 299000,
          excerpt: "Light and comfortable for daily wear.",
          thumbnail: "https://image.pollinations.ai/prompt/white%20blouse%20fashion%20minimalist",
          slug: "flowy-blouse",
        },
        {
          id: 8,
          name: "Elegant Nude Heels",
          price: 499000,
          excerpt: "Minimalist high heels for events.",
          thumbnail: "https://image.pollinations.ai/prompt/minimalist%20nude%20heels",
          slug: "elegant-nude-heels",
        },
      ],
    },
  
    tops: {
      heroImage: "https://image.pollinations.ai/prompt/minimal%20fashion%20tops%20flatlay",
      banners: [
        {
          title: "T-Shirts",
          image: "https://image.pollinations.ai/prompt/black%20basic%20tshirt%20on%20studio%20background",
          href: "/products?category=tops&subcategory=t-shirts",
        },
        {
          title: "Hoodies",
          image: "https://image.pollinations.ai/prompt/beige%20hoodie%20on%20white%20background",
          href: "/products?category=tops&subcategory=hoodies",
        },
        {
          title: "Sweatshirts",
          image: "https://image.pollinations.ai/prompt/oversized%20sweatshirt%20neutral%20fashion",
          href: "/products?category=tops&subcategory=sweatshirts",
        },
      ],
      suggested: [
        {
          id: 9,
          name: "Oversized Sweatshirt",
          price: 399000,
          excerpt: "Comfy oversized daily essential.",
          thumbnail: "https://image.pollinations.ai/prompt/oversized%20sweatshirt%20neutral%20fashion",
          slug: "oversized-sweatshirt",
        },
        {
          id: 10,
          name: "Casual Crop Top",
          price: 249000,
          excerpt: "Soft fabric and relaxed cut.",
          thumbnail: "https://image.pollinations.ai/prompt/casual%20crop%20top%20flatlay",
          slug: "casual-crop-top",
        },
      ],
    },
  
    accessories: {
      heroImage: "https://image.pollinations.ai/prompt/minimalist%20fashion%20accessories%20flatlay",
      banners: [
        {
          title: "Hats",
          image: "https://image.pollinations.ai/prompt/minimalist%20cotton%20cap%20fashion",
          href: "/products?category=accessories&subcategory=hats",
        },
        {
          title: "Belts",
          image: "https://image.pollinations.ai/prompt/minimalist%20leather%20belt%20fashion",
          href: "/products?category=accessories&subcategory=belts",
        },
        {
          title: "Sunglasses",
          image: "https://image.pollinations.ai/prompt/minimalist%20sunglasses%20fashion",
          href: "/products?category=accessories&subcategory=sunglasses",
        },
      ],
      suggested: [
        {
          id: 13,
          name: "Elegant Gold Necklace",
          price: 449000,
          excerpt: "Simple minimalist jewelry piece.",
          thumbnail: "https://image.pollinations.ai/prompt/minimalist%20gold%20necklace",
          slug: "elegant-gold-necklace",
        },
        {
          id: 14,
          name: "Leather Belt",
          price: 299000,
          excerpt: "Soft grain leather with clean buckle.",
          thumbnail: "https://image.pollinations.ai/prompt/minimalist%20leather%20belt%20fashion",
          slug: "leather-belt",
        },
      ],
    },
  };
  