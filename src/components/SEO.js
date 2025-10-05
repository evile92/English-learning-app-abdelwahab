// src/components/SEO.js - أضف هذا الكود
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "StellarSpeak - منصة تعلم اللغة الإنجليزية التفاعلية",
  description = "تعلم اللغة الإنجليزية مع StellarSpeak - منصة تفاعلية تقدم دروساً مجانية، اختبارات مستوى، وأدوات تعليمية متقدمة لتحسين مهاراتك",
  keywords = "تعلم الإنجليزية, دروس إنجليزية مجانية, قواعد اللغة الإنجليزية, اختبار مستوى الإنجليزية, مفردات إنجليزية",
  image = "https://stellarspeak.online/logo512.webp",
  url = "https://stellarspeak.online",
  type = "website",
  author = "فريق StellarSpeak",
  pageType = "website" // جديد: نوع الصفحة
}) => {

  // ✅ إضافة Structured Data
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "StellarSpeak",
      "description": description,
      "url": "https://stellarspeak.online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://stellarspeak.online/logo512.webp",
        "width": 512,
        "height": 512
      },
      "foundingDate": "2025",
      "founder": {
        "@type": "Person",
        "name": "فريق StellarSpeak"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MA",
        "addressRegion": "Tanger-Tetouan-Al Hoceima"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "English"]
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "دروس مجانية لتعلم اللغة الإنجليزية"
      },
      "educationalCredentialAwarded": "شهادة إتمام مستوى اللغة الإنجليزية",
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student",
        "audienceType": "متعلمي اللغة الإنجليزية"
      }
    };

    // إضافة بيانات خاصة حسب نوع الصفحة
    if (pageType === "course") {
      return {
        ...baseData,
        "@type": "Course",
        "name": title,
        "description": description,
        "provider": {
          "@type": "Organization",
          "name": "StellarSpeak",
          "url": "https://stellarspeak.online"
        },
        "courseMode": "online",
        "inLanguage": "ar",
        "teaches": "اللغة الإنجليزية"
      };
    }

    if (pageType === "article") {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
          "@type": "Organization",
          "name": "StellarSpeak"
        },
        "publisher": {
          "@type": "Organization",
          "name": "StellarSpeak",
          "logo": {
            "@type": "ImageObject",
            "url": "https://stellarspeak.online/logo512.webp"
          }
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "mainEntityOfPage": url,
        "image": image
      };
    }

    return baseData;
  };

  return (
    <Helmet>
      {/* الكود الموجود بالفعل... */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="StellarSpeak" />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@stellarspeak" />
      
      {/* Additional SEO Meta */}
      <meta name="theme-color" content="#1e293b" />
      <meta name="msapplication-TileColor" content="#1e293b" />
      <link rel="canonical" href={url} />
      
      {/* Language and Direction */}
      <meta httpEquiv="content-language" content="ar" />
      <meta name="language" content="Arabic" />

      {/* ✅ إضافة Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData(), null, 2)}
      </script>
    </Helmet>
  );
};

export default SEO;
