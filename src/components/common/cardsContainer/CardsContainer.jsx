import { useProductFilters } from "../../../hooks/useProductFilters";
import FilterPanel from "../filterPanel/FilterPanel";
import ProductCard from "../../products/productCard/ProductCard";
import { LoaderPage } from "../loadingSpinners/Loaders";
import styles from "./cardsContainer.module.css";

function CardsContainer({ info }) {
  const { isPending, error, cards, type, onProductSelect } = info;

  const filterHook = useProductFilters(cards || []);

  const {
    filteredProducts,
    resultCount,
    // other state and setters
    ...filterProps
  } = filterHook;

  return (
    <section className={styles.market_con}>
      <div className={`container ${styles.container}`}>
        {cards?.length !== 0 && <FilterPanel {...filterProps} resultCount={resultCount} />}

        <div className={styles.cards}>
          <div className={styles.container}>
            {isPending ? (
              <LoaderPage />
            ) : error ? (
              <h1 className="error">Error: {error.message}</h1>
            ) : filteredProducts.length === 0 ? (
              <h1 className="isEmpty">No products match your filters</h1>
            ) : (
              filteredProducts.map(
                (p) =>
                  (p.stock > 0 || p.stock === undefined) && (
                    <ProductCard
                      data={p}
                      key={p.id || p.fireId}
                      onProductSelect={onProductSelect}
                    />
                  )
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CardsContainer;
