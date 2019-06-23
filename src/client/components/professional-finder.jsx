import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Pagination,
    Alert,
    Spinner,
} from 'react-bootstrap';
import PropTypes from 'prop-types'
import SearchForm from '../components/search-form.jsx'
import SearchResultsTable from './search-results-table.jsx';

class ProfessionalFinder extends Component {
    constructor(props) {
        super(props);

        this.maxResultsPerPage = 20;

        this.handlePageChanged = evt => {
            let pageClicked;

            if (evt.target.innerText.indexOf("«") > -1) {
                pageClicked = 0;
            } else if (evt.target.innerText.indexOf("»") > -1) {
                pageClicked = this.props.localProValues.searchResults.numPages - 1;
            } else {
                pageClicked = Number.parseInt(evt.target.text) - 1; // 0 indexed
            }

            const newPageResultsOffset = pageClicked * (this.maxResultsPerPage - 1) // 0 indexed;

            // Replace with action dispatch...

            // this.updateSearchResults(
            //     this.state.categoryId,
            //     this.state.location,
            //     newPageResultsOffset
            // );
        }
    };

    render() {
        let pages = [];
        for (let i = 0; i < this.props.localProValues.searchResults.numPages; i++) {
            pages.push(
                <Pagination.Item
                    key={i}
                    active={this.props.localProValues.searchResults.activePage === (i + 1)}
                    onClick={this.handlePageChanged}
                >
                    {i + 1}
                </Pagination.Item>
            )
        }
        return (
            <Container data-testid="pro-finder__container" className="pro-finder__container">
                <Row data-testid="pro-finder__title-row" className="pro-finder__title-row">
                    <Col data-testid="pro-finder__title-col" className="pro-finder__title-col">
                        <h3 data-testid="pro-finder__title" className="pro-finder__title">
                            Find a Local Professional
                        </h3>
                    </Col>
                </Row>
                <Row data-testid="pro-finder__search-form-row" className="pro-finder__search-form-row">
                    <Col data-testid="pro-finder__search-form-col" className="pro-finder__search-form-col">
                        <SearchForm
                            data-testid="pro-finder__search-form"
                            className="pro-finder__search-form"
                            localProValues={this.props.localProValues}
                            store={this.props.store}
                        />
                    </Col>
                </Row>
                <Row data-testid="pro-finder__search-results-row">
                    <Col
                        data-testid="pro-finder__search-results-table-col"
                        className="pro-finder__search-results-table-col"
                    >
                        {
                            this.props.localProValues.loading ?
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                                : this.props.localProValues.searchResults.error ?
                                    <Alert variant="danger">
                                        {this.props.localProValues.searchResults.error}
                                    </Alert>
                                    : this.props.localProValues.searchResults.searchResults.length === 0 ?
                                        <Alert variant="info">Make a search above!</Alert>
                                        :
                                        <SearchResultsTable
                                            data-testid="pro-finder__search-results-table"
                                            className="pro-finder__search-results-table"
                                            searchResults={this.props.localProValues.searchResults.searchResults}
                                            error={this.props.localProValues.searchResults.error}
                                            proFinderValues={this.proFinderValues}
                                        />
                        }

                    </Col>
                </Row>
                {
                    this.props.localProValues.searchResults.loading === true ? null :
                        <Row data-testid="pro-finder__pagination-control-row" className="pro-finder__pagination-control-row">
                            <Col
                                data-testid="pro-finder__pagination-control-col"
                                className="pro-finder__pagingation-control-col"
                            >
                                {
                                    pages.length > 1 ?
                                        <Pagination
                                            data-testid="pro-finder__pagination-control"
                                            className="pro-finder__pagination-control"
                                        >
                                            <Pagination.First
                                                className="pro-finder__pagination-first-item"
                                                onClick={this.handlePageChanged}
                                                key={0}
                                            />
                                            {pages}
                                            <Pagination.Last
                                                className="pro-finder__pagination-last-item"
                                                onClick={this.handlePageChanged}
                                                key={this.props.localProValues.searchResults.numPages - 1}
                                            />
                                        </Pagination> : null
                                }
                            </Col>
                        </Row>
                }
            </Container>
        );
    };
}

ProfessionalFinder.propTypes = {
    proFinderService: PropTypes.object,
    categories: PropTypes.array
}

export default ProfessionalFinder;
