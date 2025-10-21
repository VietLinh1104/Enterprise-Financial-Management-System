/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Assets } from '../models/Assets';
import type { AssetsRequest } from '../models/AssetsRequest';
import type { Pageable } from '../models/Pageable';
import type { PageAssets } from '../models/PageAssets';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AssetsControllerService {
    /**
     * @param id
     * @returns Assets OK
     * @throws ApiError
     */
    public static getAssetById(
        id: string,
    ): CancelablePromise<Assets> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/assets/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Assets OK
     * @throws ApiError
     */
    public static updateAsset(
        id: string,
        requestBody: AssetsRequest,
    ): CancelablePromise<Assets> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/assets/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteAsset(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/assets/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param pageable
     * @returns PageAssets OK
     * @throws ApiError
     */
    public static getAllAssetsPage(
        pageable: Pageable,
    ): CancelablePromise<PageAssets> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/assets',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Assets OK
     * @throws ApiError
     */
    public static createAsset(
        requestBody: AssetsRequest,
    ): CancelablePromise<Assets> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/assets',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns Assets OK
     * @throws ApiError
     */
    public static getAllAssets(): CancelablePromise<Array<Assets>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/assets/all',
        });
    }
    /**
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static deleteListAssets(
        requestBody: Array<string>,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/assets/batch-delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
