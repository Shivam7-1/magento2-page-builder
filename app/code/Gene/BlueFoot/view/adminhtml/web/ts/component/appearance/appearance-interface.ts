/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../data-store";

export default interface AppearancesInterface {
    /**
     * Apply appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    apply(data: DataObject): DataObject;
}