import styles from "./cardsContainer.module.css";
import SearchAndCategories from "../searchAndCategories/SearchAndCategories";
import ProductCard from "../../products/productCard/ProductCard";
import { useEffect, useState } from "react";
import { LoaderPage } from "../loadingSpinners/Loaders";

function CardsContainer({ info }) {
  const { isPending, error, categories, defaultCategory, cards, type, onProductSelect } = info;
  const [searchData, setSearchData] = useState({ searchTerm: "", selectedCategory: defaultCategory });
  const [filteredCards, setFilteredCards] = useState(cards || []);

  useEffect(() => {
    let filtered = cards || [];

    if (searchData.searchTerm) {
      const term = searchData.searchTerm.toLowerCase();
      filtered = filtered.filter(card => 
        card.name?.toLowerCase().includes(term) || 
        card.brand?.toLowerCase().includes(term)
      );
    }

    if (searchData.selectedCategory && searchData.selectedCategory !== "all") {
      filtered = filtered.filter(card => 
        card.type?.toLowerCase() === searchData.selectedCategory.toLowerCase()
      );
    }

    setFilteredCards(filtered);
  }, [searchData, cards]);

  return (
    <section className={styles.market_con}>
      <div className={`container ${styles.container}`}>
        {cards?.length !== 0 && <SearchAndCategories categories={categories} searchData={searchData} setSearchData={setSearchData} />}
        <div className={styles.cards}>
          <div className={`${styles.container}`}>
            {isPending ? (
              <LoaderPage />
            ) : error ? (
              <h1 className="error">Error: {error.message}</h1>
            ) : filteredCards.length === 0 ? (
              <h1 className="isEmpty">No results found</h1>
            ) : (
              filteredCards.map((p) => (
                (p.stock > 0 || p.stock === undefined) && (
                  <ProductCard data={p} key={p.id || p.fireId} onProductSelect={onProductSelect} />
                )
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CardsContainer;