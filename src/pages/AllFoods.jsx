import React, { useEffect, useState } from 'react';
import Helmet from '../components/Helmet/Helmet';
import CommonSection from '../components/UI/common-section/CommonSection';
import { Col, Container, Row } from 'reactstrap';
import ProductCard from '../components/UI/product-card/ProductCard';
import ReactPaginate from 'react-paginate';
import "../styles/pagination.css";

const AllFoods = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedSortOption, setSelectedSortOption] = useState('default');

  useEffect(() => {
    fetch('https://foodwebsite-server.onrender.com/foods')
      .then(res => res.json())
      .then(product => setAllProducts(product))
  }, []);

  const foodPerPage = 10;
  const pagesVisited = pageNumber * foodPerPage;

  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts];
  if (selectedSortOption === 'ascending') {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSortOption === 'descending') {
    sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
  } else if (selectedSortOption === 'high-price') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSortOption === 'low-price') {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  const displayFoods = sortedProducts
    .slice(pagesVisited, pagesVisited + foodPerPage)
    .map(item => (
      <Col lg="3" md="4" sm="6" xs="12" key={item.id} className="mb-4">  {/* Changed xs="6" to xs="12" */}
        <ProductCard item={item} />
      </Col>
    ));

  const pageCount = Math.ceil(sortedProducts.length / foodPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleSortChange = (e) => {
    setSelectedSortOption(e.target.value);
    setPageNumber(0);
  };

  return (
    <Helmet title="All-Foods">
      <CommonSection title="All Foods" />

      <section>
        <Container>
          <Row className="mb-4">
            <Col lg="6" md="6" sm="12" className="mb-3 mb-md-0">
              <div className="search__widget d-flex align-items-center">
                <input
                  type="text"
                  placeholder=" I'm looking for...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>

            <Col lg="6" md="6" sm="12" xs="12" className="mb-5">
              <div className="sorting__widget text-end">
                <select className="w-50" value={selectedSortOption} onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="ascending">Alphabetically, A-Z</option>
                  <option value="descending">Alphabetically, Z-A</option>
                  <option value="high-price">High Price</option>
                  <option value="low-price">Low Price</option>
                </select>
              </div>
            </Col>
          </Row>
          <Row>
            {displayFoods}
            <div className="pagination__container">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName="paginationBttns"
              />
            </div>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllFoods;
