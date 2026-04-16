import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronRight,
  FaUser,
  FaPrint,
  FaShoppingCart,
  FaTruck,
  FaGift,
  FaLeaf,
  FaGem,
  FaBuilding,
  FaUniversity,
  FaChalkboardTeacher,
  FaWater,
  FaFutbol,
  FaCertificate,
  FaIdCard,
  FaCalendarAlt,
  FaUserTie,
} from "react-icons/fa";
import styles from "./home.module.css";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigateToMarket = () => {
    navigate("/market");
  };

  const services = [
    {
      icon: <FaShoppingCart className={styles.serviceIcon} />,
      title: t("serviceRetailWholesaleTitle"),
      description: t("serviceRetailWholesaleDesc"),
      color: styles.gradientAmber,
      iconBg: styles.iconBgAmber,
    },
    {
      icon: <FaLeaf className={styles.serviceIcon} />,
      title: t("serviceProductVarietyTitle"),
      description: t("serviceProductVarietyDesc"),
      color: styles.gradientAmber,
      iconBg: styles.iconBgEmerald,
    },
    {
      icon: <FaGift className={styles.serviceIcon} />,
      title: t("serviceOriginalInksTitle"),
      description: t("serviceOriginalInksDesc"),
      color: styles.gradientAmber,
      iconBg: styles.iconBgRose,
    },
    {
      icon: <FaTruck className={styles.serviceIcon} />,
      title: t("serviceFastDeliveryTitle"),
      description: t("serviceFastDeliveryDesc"),
      color: styles.gradientAmber,
      iconBg: styles.iconBgBlue,
    },
  ];

  const workSteps = [
    {
      step: 1,
      title: t("stepCreateAccountTitle"),
      description: t("stepCreateAccountDesc"),
      icon: <FaUser className={styles.stepIcon} />,
      delay: "0s",
    },
    {
      step: 2,
      title: t("stepBrowseProductsTitle"),
      description: t("stepBrowseProductsDesc"),
      icon: <FaPrint className={styles.stepIcon} />,
      delay: "0.2s",
    },
    {
      step: 3,
      title: t("stepSelectItemsTitle"),
      description: t("stepSelectItemsDesc"),
      icon: <FaShoppingCart className={styles.stepIcon} />,
      delay: "0.4s",
    },
    {
      step: 4,
      title: t("stepFastDeliveryTitle"),
      description: t("stepFastDeliveryDesc"),
      icon: <FaTruck className={styles.stepIcon} />,
      delay: "0.6s",
    },
  ];

  // Top Clients List (can be expanded)
  const topClients = [
    { name: t("clientGizaWater"), icon: <FaWater /> },
    { name: t("clientYouthSports"), icon: <FaFutbol /> },
    { name: t("clientNileClub"), icon: <FaBuilding /> },
    { name: t("clientAdultEducation"), icon: <FaChalkboardTeacher /> },
    { name: t("clientCairoUniversity"), icon: <FaUniversity /> },
    { name: t("clientMinistry"), icon: <FaBuilding /> },
    // Add more as needed
  ];

  return (
    <div className={styles.container}>
      {/* Floating Background Elements */}
      <div className={styles.floatingBackground}>
        <div className={`${styles.floatingCircle} ${styles.circleAmber}`}></div>
        <div
          className={`${styles.floatingCircle} ${styles.circleEmerald}`}
        ></div>
        <div className={`${styles.floatingCircle} ${styles.circleRose}`}></div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.heroBadge}>
                <FaGem className={styles.badgeIcon} />
                {t("premiumComputerAccessoriesCollection")}
              </div>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleGradient}>
                  {t("discover")}
                </span>
                <br />
                <span className={styles.heroTitleGradientEmerald}>
                  {t("computerAccessories")}
                </span>{" "}
                <span>&</span>{" "}
                <span className={styles.heroTitleGradient}>{t("Inks")}</span>
                <br />
                <span>{t("at")}</span>{" "}
                <span className={styles.heroTitleGradientAL3ALAMIA}>
                  {t("siteName")}
                </span>
              </h1>
              <p className={styles.heroDescription}>
                {t("heroTrustedSourceDescription")}
              </p>
              <div className={styles.heroButtons}>
                <button
                  className={styles.exploreButton}
                  onClick={handleNavigateToMarket}
                >
                  <span className={styles.buttonContent}>
                    {t("exploreCollection")}{" "}
                    <FaChevronRight className={styles.buttonIcon} />
                  </span>
                </button>
              </div>
            </div>

            <div className={styles.heroImage}>
              <div className={styles.cardContainer}>
                <div
                  className={styles.mainCard}
                  style={{ transform: `translateY(${scrollY * 0.02}px)` }}
                >
                  <div className={styles.cardGlow}></div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardIconContainer}>
                      {t("siteName")}
                    </div>
                    <div className={styles.cardTitle}>
                      {t("welcomeToSite", { site: t("siteName") })}
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardInfoLabel}>{t("Since")}</div>
                      <div className={styles.cardInfoYear}>2010</div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles.accentCircle} ${styles.accentRose}`}
                ></div>
                <div
                  className={`${styles.accentCircle} ${styles.accentBlue}`}
                ></div>
                <div
                  className={`${styles.accentCircle} ${styles.accentPurple}`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.worksSection}>
        <div className={styles.worksContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{t("simpleProcess")}</div>
            <h2 className={styles.sectionTitle}>
              {t("howIt")}{" "}
              <span className={styles.sectionTitleGradient}>{t("works")}</span>
            </h2>
            <p className={styles.sectionDescription}>
              {t("experienceShoppingInFourSteps")}
            </p>
          </div>

          <div className={styles.worksGrid}>
            {workSteps.map((step, index) => (
              <div
                key={index}
                className={styles.workStep}
                style={{ animationDelay: step.delay }}
              >
                {index < workSteps.length - 1 && (
                  <div className={styles.connectionLine}></div>
                )}
                <div className={styles.stepContent}>
                  <div className={styles.stepIconContainer}>
                    <div className={styles.stepIcon}>{step.icon}</div>
                  </div>
                  <div className={styles.stepNumber}>{step.step}</div>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section - Enhanced */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutPatternOverlay}></div>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutSplitLayout}>
            {/* Left: Identity Panel */}
            <div className={styles.aboutIdentityPanel}>
              <div className={styles.aboutYearStamp}>
                <span className={styles.aboutYearNumber}>2010</span>
                <span className={styles.aboutYearLabel}>{t("founded")}</span>
              </div>
              <div className={styles.aboutLogoBlock}>
                <FaBuilding className={styles.aboutBuildingIcon} />
                <h2 className={styles.aboutCompanyName}>
                  {t("siteName")}
                </h2>
                <p className={styles.aboutCompanyFullName}>
                  {t("companyFullName") || "Al-Alamiah Company for Importing and Supplying Inks and Computer Supplies"}
                </p>
              </div>
              <div className={styles.aboutOwnerTag}>
                <FaUserTie className={styles.aboutOwnerIcon} />
                <div>
                  <span className={styles.aboutOwnerLabel}>{t("owner") || "Owner"}</span>
                  <span className={styles.aboutOwnerName}>
                    {t("ownerName") || "Khaled Fathy Marzouk"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Details Panel */}
            <div className={styles.aboutDetailsPanel}>
              <div className={styles.aboutBadgeRow}>
                <span className={styles.aboutSectionBadge}>{t("aboutUsBadge") || "About Us"}</span>
              </div>
              <h3 className={styles.aboutSectionTitle}>
                {t("aboutUs") || "About"}{" "}
                <span className={styles.aboutTitleAccent}>{t("company") || "Our Company"}</span>
              </h3>
              <p className={styles.aboutParagraph}>
                {t("aboutUsDescription") || "We are a leading Egyptian company specializing in the import and supply of inks and computer supplies, serving government entities and private sector organizations with excellence since 2010."}
              </p>

              {/* Credentials Grid */}
              <div className={styles.credentialsGrid}>
                <div className={styles.credentialCard}>
                  <div className={styles.credentialIconWrap}>
                    <FaIdCard className={styles.credentialIcon} />
                  </div>
                  <div className={styles.credentialText}>
                    <span className={styles.credentialTitle}>{t("commercialRegistration") || "Commercial Registration"}</span>
                    <span className={styles.credentialSub}>{t("commercialRegNumber") || "Registered & Verified"}</span>
                  </div>
                </div>
                <div className={styles.credentialCard}>
                  <div className={styles.credentialIconWrap}>
                    <FaCertificate className={styles.credentialIcon} />
                  </div>
                  <div className={styles.credentialText}>
                    <span className={styles.credentialTitle}>{t("taxCard") || "Tax Card"}</span>
                    <span className={styles.credentialSub}>{t("taxCardNumber") || "Tax Compliant"}</span>
                  </div>
                </div>
                <div className={styles.credentialCard}>
                  <div className={styles.credentialIconWrap}>
                    <FaCalendarAlt className={styles.credentialIcon} />
                  </div>
                  <div className={styles.credentialText}>
                    <span className={styles.credentialTitle}>{t("work History") || "Work History"}</span>
                    <span className={styles.credentialSub}>{t("work History Years") || "15+ Years Active"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadgeAmber}>
              {t("premiumServices")}
            </div>
            <h2 className={styles.sectionTitle}>
              {t("our")}{" "}
              <span className={styles.sectionTitleGradientEmerald}>
                {t("services")}
              </span>
            </h2>
            <p className={styles.sectionDescription}>
              {t("elevatingYourShoppingExperience")}
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div
                key={index}
                className={`${styles.serviceCard} ${service.color}`}
              >
                <div className={styles.serviceCardOverlay}></div>
                <div className={styles.serviceContent}>
                  <div
                    className={`${styles.serviceIconContainer} ${service.iconBg}`}
                  >
                    {service.icon}
                  </div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>
                    {service.description}
                  </p>
                  <div className={styles.serviceLink}>
                    {t("learnMore")}{" "}
                    <FaChevronRight className={styles.serviceLinkIcon} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Clients Section */}
      <section className={styles.topClientsSection}>
        <div className={styles.clientsPatternBg}></div>
        <div className={styles.topClientsContainer}>
          {/* Header */}
          <div className={styles.clientsHeaderRow}>
            <div className={styles.clientsHeaderLeft}>
              <span className={styles.clientsSectionBadge}>
                {t("topClientsBadge") || "Our Partners"}
              </span>
              <h2 className={styles.clientsSectionTitle}>
                {t("our") || "Our"}{" "}
                <span className={styles.clientsTitleGold}>
                  {t("topClients") || "Top Clients"}
                </span>
              </h2>
            </div>
            <div className={styles.clientsHeaderRight}>
              <p className={styles.clientsHeaderDesc}>
                {t("topClientsSubtitle") || "Trusted by leading government bodies and private institutions for over five years."}
              </p>
              <div className={styles.clientsYearsBadge}>
                <span className={styles.clientsYearsNum}>5+</span>
                <span className={styles.clientsYearsText}>{t("yearsOfTrust") || "Years of Trust"}</span>
              </div>
            </div>
          </div>

          {/* Clients Showcase */}
          <div className={styles.clientsShowcase}>
            {topClients.map((client, idx) => (
              <div key={idx} className={`${styles.clientShowcaseCard} ${idx % 2 === 0 ? styles.clientCardEven : styles.clientCardOdd}`}>
                <div className={styles.clientCardNumber}>0{idx + 1}</div>
                <div className={styles.clientIconLarge}>{client.icon}</div>
                <h3 className={styles.clientShowcaseName}>{client.name}</h3>
                <div className={styles.clientCardAccentLine}></div>
              </div>
            ))}
          </div>

          <p className={styles.clientsNote}>
            {t("clientsNote") || "And many more valued partners across Egypt"}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadgeStone}>{t("getInTouch")}</div>
            <h2 className={styles.sectionTitle}>{t("contactUs")}</h2>
            <p className={styles.sectionDescription}>
              {t("connectWithOurExperts")}
            </p>
          </div>

          <div className={styles.contactForm}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder={t("yourName")}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder={t("yourEmail")}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                placeholder={t("yourMessage")}
                rows="6"
                className={styles.formTextarea}
              ></textarea>
            </div>
            <button type="button" className={styles.formButton}>
              <span className={styles.buttonContent}>
                {t("sendMessage")}{" "}
                <FaChevronRight className={styles.buttonIcon} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className={styles.footerSection}>
        <div className={styles.footerContainer}>
          <h2 className={styles.footerTitle}>
            {t("everythingYouNeedFor")}{" "}
            <span className={styles.footerTitleGradient}>
              {t("computersAndPrinting")}
            </span>
          </h2>

          <p className={styles.footerDescription}>
            {t("shopAccessoriesAndInksDescription")}
          </p>

          <div className={styles.footerButtons}>
            <button
              className={styles.startShoppingButton}
              onClick={handleNavigateToMarket}
            >
              <span className={styles.buttonContent}>
                {t("startShopping")}{" "}
                <FaShoppingCart className={styles.buttonIcon} />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;