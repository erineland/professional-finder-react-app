import axios from 'axios';

export default class ProFinderService {
    static getProfessionCategories(port) {
        const axiosConfig = {
            method: 'get',
            url: 'http://localhost:8080/api/categories'
        }

        return axios(axiosConfig).then(professionCategories => {
            const visibleProfessionCategories = professionCategories.data.filter(professionCategory => !professionCategory.hidden);
            this.cachedVisibleCategories = visibleProfessionCategories;
            return visibleProfessionCategories;
        }).catch(error => {
            const getCategoriesError =
                new Error(`Error at proFinderService.getProfessionCategories: ${error.message}`);
            console.error(getCategoriesError.message);
            throw getCategoriesError;
        })
    }

    static throwAndLogParameterError(invalidParameter) {
        const searchProError = new Error(
            `ProFinderService.searchForLocalProfessional: Please pass in valid parameter ${invalidParameter}`
        )
        console.error(searchProError.message);
        throw searchProError
    }

    static searchForLocalProfessionals(categoryId, location, paginationOffsetHeader) {
        if (!categoryId || typeof (categoryId) !== 'number') {
            this.throwAndLogParameterError(`categoryId`);
        }

        if (
            paginationOffsetHeader === undefined ||
            paginationOffsetHeader === null ||
            typeof (paginationOffsetHeader) !== 'number'
        ) {
            this.throwAndLogParameterError(`paginationOffsetHeader`);
        }

        if (!location || typeof (location) !== 'string') {
            this.throwAndLogParameterError(`location`);
        }

        // We always want this to be 20, this can be configured here.
        const maxResultsPerPage = 20;
        const xPaginationLimitHeader = maxResultsPerPage;
        const proFinderApiUrl = 'https://demo.plentific.com/find-a-pro/api/v2/public/pro/search-pros/';
        const data = {
            'category_id': categoryId,
            location
        };
        const axiosConfig = {
            method: 'post',
            url: proFinderApiUrl,
            headers: {
                'content-type': 'application/json',
                'x-pagination-limit': xPaginationLimitHeader,
                'x-pagination-offset': paginationOffsetHeader
            },
            data: data,
        }
        return axios(axiosConfig).then(response => {
            return {
                totalCount: response.headers['x-pagination-count'],
                offset: response.headers['x-pagination-offset'],
                results: response.data.response.pros,
            };
        }).catch(error => {
            const searchError = new Error(`Error at proFinderService.searchForLocalProfessionals: ${error.message}`);
            console.error(searchError.message);
            throw searchError;
        });
    }
}
