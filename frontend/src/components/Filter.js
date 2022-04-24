import { Form, Button } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/filter.css";

function Filter({inStock, setInStock, minPrice, setMinPrice, maxPrice, setMaxPrice, sortBy, setSortBy, filterButton}) {

  /* -------------------- ensure-maxPrice-is-within-limits -------------------- */
  useEffect(() => {
    if(maxPrice>100000){
      setMaxPrice(100000);
    }else if(maxPrice<0){
      setMaxPrice(0);
    }
  },[maxPrice]);
  /* -------------------- ensure-minPrice-is-within-limits -------------------- */
  useEffect(() => {
    if(minPrice>100000){
      setMinPrice(100000);
    }else if(minPrice<0){
      setMinPrice(0);
    }
  },[minPrice]);

  return (
    <div>
        <Form.Group>
            <div className="filter-row">
              <span className="filter-col">
                <Form.Label size="sm" className="price-label" htmlFor="minprice">Price</Form.Label>
                <Form.Control size="sm" min={0} max={10} className="price-filter" value={minPrice} onChange={(e)=>{setMinPrice(e.target.value)}}  type="number" id="minprice" name="minprice" placeholder="Low"/>
                <Form.Label size="sm" className="price-label" htmlFor="maxprice">To</Form.Label>
                <Form.Control size="sm" min={0} max={10} className="price-filter" value={maxPrice} onChange={(e)=>{setMaxPrice(e.target.value)}} type="number" id="maxprice" placeholder="High"/>
              </span>
              <span className="filter-col">
                <Form.Label htmlFor="sort-homeitem" size="sm">Sort By: </Form.Label>
                <Form.Select size="sm" className="sort-filter" value={sortBy} onChange={(e)=>{setSortBy(e.target.value)}} id="sort-homeitem" name="sort-homeitem">
                  {/* <option value="">Relevancy</option> */}
                  <option value="price">Price</option>
                  <option value="quantity">Quantity</option>
                  <option value="salesCount">Sales Count</option>
                </Form.Select>
              </span>
              <span className="filter-col">
                <Form.Check size="sm" className="exclude-filter" value={inStock} onChange={(e)=>{setInStock(e.target.checked)}} type="checkbox" label="Show in stock items only" />
              </span>
              <span className="filter-col">
                <Button size="sm" className="filter-button" onClick={filterButton}>Filter</Button>
              </span>
            </div>
          </Form.Group>
    </div>
  )
}

export default Filter