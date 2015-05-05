/// <reference path="Core.ts" />

module fl
{
    export class Resource
    {
        private _id:string;

        constructor(id:string)
        {
            this._id = id;
        }

        createInstance():FlashObject
        {
            throw new Error("Not implemented");
        }

        public dispose()
        {
            throw new Error("Not implemented");
        }

        get id():string
        {
            return this._id;
        }
    }
}
