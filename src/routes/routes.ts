/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ReefV0FinancialsController } from './reefapi.v0.js';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "RestaurantFormatForDatabase": {
        "dataType": "refObject",
        "properties": {
            "store_name": {"dataType":"string","required":true},
            "external_store_id": {"dataType":"string","required":true},
            "country": {"dataType":"string","required":true},
            "country_code": {"dataType":"string","required":true},
            "city": {"dataType":"string","required":true},
            "date": {"dataType":"datetime","required":true},
            "restaurant_opened_at": {"dataType":"datetime","required":true},
            "menu_available": {"dataType":"boolean","required":true},
            "restaurant_online": {"dataType":"boolean","required":true},
            "restaurant_offline": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_RestaurantFormatForDatabase-Array_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"RestaurantFormatForDatabase"},"required":true},
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "count": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.get('/reeftech/v0/financials',
            ...(fetchMiddlewares<RequestHandler>(ReefV0FinancialsController)),
            ...(fetchMiddlewares<RequestHandler>(ReefV0FinancialsController.prototype.getFinancials)),

            async function ReefV0FinancialsController_getFinancials(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    location: {"in":"query","name":"location","required":true,"dataType":"string"},
                    term: {"in":"query","name":"term","required":true,"dataType":"string"},
                    categories: {"in":"query","name":"categories","required":true,"dataType":"string"},
                    open_now: {"in":"query","name":"open_now","required":true,"dataType":"boolean"},
                    limit: {"in":"query","name":"limit","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ReefV0FinancialsController();

              await templateService.apiHandler({
                methodName: 'getFinancials',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
