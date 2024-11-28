import z from 'zod';
import { ApiRoute, apiRoutes, ApiRouteParams } from '../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class SuperFetchError extends Error {
    code : number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.name = "SuperFetchError";
    }
}

interface SuperFetchOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    includeCredentials?: boolean;
}

interface SuperFetchParams<Request, Response, Route extends ApiRoute = ApiRoute, QueryParams extends undefined | Record<string, any> = undefined> {
    options: SuperFetchOptions;
    route: Route;
    routeParams?: ApiRouteParams<Route>;
    queryParams?: QueryParams;
    responseSchema: z.ZodType<Response>;
    payload?: Request;
}

export async function superFetch<Request, Response, Route extends ApiRoute = ApiRoute, QueryParams extends Record<string, any> | undefined = undefined>(
    { options, route, routeParams, queryParams, responseSchema, payload }: SuperFetchParams<Request, Response, Route, QueryParams>
): Promise<Response> {

    if (routeParams === undefined) {
        routeParams = [] as ApiRouteParams<Route>;
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    
    if (options.includeCredentials) {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        else {
            throw new Error("No token found");
        }
    }

    // @ts-ignore
    let realRoute = apiRoutes[route](...routeParams); 

    if (queryParams) {
        const query = new URLSearchParams();
        
        for (const key in queryParams) {
            if (queryParams[key] === undefined || !queryParams[key]?.toString) {
                continue;
            }
            query.append(key, queryParams[key].toString());
        }


        realRoute += `?${query.toString()}`;
    }


    console.log(`${options.method} / ${realRoute}`);

    const response = await fetch(realRoute, {
        method: options.method,
        headers: headers,
        body: payload ? JSON.stringify(payload) : undefined,
        credentials: options.includeCredentials ? 'include' : 'omit',
    });
    
    if (response.ok) {
        const data = await response.json();
        try {
            return responseSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.log(error.errors);
            }

            throw new SuperFetchError("El servidor envió una respuesta inesperada", response.status);
        }
    } else {
        const data = await response.json();
        console.log(data);
        throw new SuperFetchError(data.error ?? "Ocurrió un error", response.status);
        }
    
}