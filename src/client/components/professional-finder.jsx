import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Pagination,
    Alert,
    Spinner,
} from 'react-bootstrap';
import ProFinderService from '../service/pro-finder-service';
import SearchForm from '../components/search-form.jsx'
import SearchResultsTable from './search-results-table.jsx';
import { connect } from 'react-redux';

class ProfessionalFinder extends Component {
    constructor(props) {
        super(props);

        this.handlePageChanged = evt => {
            debugger;
            let pageClicked;

            if (evt.target.innerText.indexOf("«") > -1) {
                pageClicked = 0;
            } else if (evt.target.innerText.indexOf("»") > -1) {
                pageClicked = this.props.numPages - 1;
            } else {
                pageClicked = Number.parseInt(evt.target.text) - 1; // 0 indexed
            }

            const newPageResultsOffset = pageClicked * (20 - 1) // 0 indexed;

            // Replace with action dispatch...
            this.props.updatePage(newPageResultsOffset);
        };
    }

    render() {
        let pages = [];
        for (let i = 0; i < this.props.numPages; i++) {
            pages.push(
                <Pagination.Item
                    key={i}
                    active={this.props.activePage === (i + 1)}
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
                        />
                    </Col>
                </Row>
                <Row data-testid="pro-finder__search-results-row">
                    <Col
                        data-testid="pro-finder__search-results-table-col"
                        className="pro-finder__search-results-table-col"
                    >
                        {
                            this.props.searchLoading ?
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                                : this.props.searchError ?
                                    <Alert variant="danger">
                                        {this.props.searchError}
                                    </Alert>
                                    : this.props.searchResults ? this.props.searchResults.length === 0 ?
                                        <Alert variant="info">Make a search above!</Alert>
                                        :
                                        <SearchResultsTable
                                            data-testid="pro-finder__search-results-table"
                                            className="pro-finder__search-results-table"
                                        />
                                        : null
                        }

                    </Col>
                </Row>
                {
                    this.props.loading === true ? null :
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
                                                key={this.props.numPages - 1}
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

const mapStateToProps = state => ({
    searchResults: state.searchResults.searchResults,
    searchLoading: state.searchResults.loading,
    searchError: state.searchResults.error,
    activePage: state.searchResults.activePage,
    numPages: state.searchResults.numPages,
})

const mapDispatchToProps = dispatch => ({
    updatePage: searchResultsOffset => {
        dispatch({
            type: 'SEARCH_LOCAL_PROS',
            payload: ProFinderService.searchForLocalProfessional(
                Number.parseInt(searchParams.categoryId),
                searchParams.location,
                0
            )
        })
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfessionalFinder);
