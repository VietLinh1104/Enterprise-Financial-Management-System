/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contracts } from '../models/Contracts';
import type { ContractsRequest } from '../models/ContractsRequest';
import type { Pageable } from '../models/Pageable';
import type { PageContracts } from '../models/PageContracts';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContractsControllerService {
    /**
     * @param id
     * @returns Contracts OK
     * @throws ApiError
     */
    public static getContractById(
        id: string,
    ): CancelablePromise<Contracts> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contracts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Contracts OK
     * @throws ApiError
     */
    public static updateContract(
        id: string,
        requestBody: ContractsRequest,
    ): CancelablePromise<Contracts> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/contracts/{id}',
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
    public static deleteContract(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/contracts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param pageable
     * @returns PageContracts OK
     * @throws ApiError
     */
    public static getAllContractsPage(
        pageable: Pageable,
    ): CancelablePromise<PageContracts> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contracts',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Contracts OK
     * @throws ApiError
     */
    public static createContract(
        requestBody: ContractsRequest,
    ): CancelablePromise<Contracts> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contracts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns Contracts OK
     * @throws ApiError
     */
    public static getAllContracts(): CancelablePromise<Array<Contracts>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contracts/all',
        });
    }
    /**
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static deleteListContracts(
        requestBody: Array<string>,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/contracts/batch-delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
