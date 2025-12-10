/**
 * Data Provider for Variable Display Component
 * Retrieves variables associated with a record through direct or M2M relationships
 */

(function() {
    'use strict';

    /**
     * Main data provider function
     * @param {Object} input - Input parameters including record sys_id and configuration
     * @returns {Object} Result object containing variables data or error information
     */
    data.variableDataProvider = function(input) {
        var result = {
            variables: [],
            error: null,
            hasData: false
        };

        try {
            // Extract configuration parameters
            var recordId = input.recordId || input.sysId;
            var tableName = input.table;
            var variableTable = input.variableTable || 'item_option_new';
            var relationshipType = input.relationshipType || 'direct';
            var m2mTable = input.m2mTable || '';
            var m2mSourceField = input.m2mSourceField || 'parent';
            var m2mVariableField = input.m2mVariableField || 'variable';
            var displayFields = input.displayFields || 'question_text,value,type';
            var maxRecords = input.maxRecords || 50;

            // Validate required inputs
            if (!recordId) {
                result.error = 'Record ID is required';
                return result;
            }

            // Parse display fields
            var fieldsArray = displayFields.split(',').map(function(field) {
                return field.trim();
            });

            // Retrieve variables based on relationship type
            if (relationshipType === 'direct') {
                result.variables = getDirectVariables(
                    recordId,
                    variableTable,
                    fieldsArray,
                    maxRecords
                );
            } else if (relationshipType === 'm2m') {
                if (!m2mTable) {
                    result.error = 'M2M table name is required for M2M relationship type';
                    return result;
                }
                result.variables = getM2MVariables(
                    recordId,
                    variableTable,
                    m2mTable,
                    m2mSourceField,
                    m2mVariableField,
                    fieldsArray,
                    maxRecords
                );
            } else {
                result.error = 'Invalid relationship type: ' + relationshipType;
                return result;
            }

            result.hasData = result.variables.length > 0;

        } catch (e) {
            result.error = 'Error retrieving variables: ' + e.message;
            gs.error('Variable Display Component Error: ' + e.message);
        }

        return result;
    };

    /**
     * Get variables directly associated with a record
     * @param {String} recordId - sys_id of the current record
     * @param {String} variableTable - Table containing variables
     * @param {Array} fields - Fields to retrieve
     * @param {Number} maxRecords - Maximum records to retrieve
     * @returns {Array} Array of variable objects
     */
    function getDirectVariables(recordId, variableTable, fields, maxRecords) {
        var variables = [];
        var gr = new GlideRecord(variableTable);
        
        // Add query to find variables associated with this record
        // Common field names for associations
        var associationFields = ['parent', 'document_key', 'sys_target', 'request_item', 'task'];
        var queryAdded = false;
        
        for (var i = 0; i < associationFields.length; i++) {
            if (gr.isValidField(associationFields[i])) {
                if (queryAdded) {
                    gr.addOrCondition(associationFields[i], recordId);
                } else {
                    gr.addQuery(associationFields[i], recordId);
                    queryAdded = true;
                }
            }
        }
        
        if (!queryAdded) {
            gs.warn('No valid association field found in table: ' + variableTable);
            return variables;
        }
        
        gr.setLimit(maxRecords);
        gr.query();

        while (gr.next()) {
            var variable = buildVariableObject(gr, fields);
            variables.push(variable);
        }

        return variables;
    }

    /**
     * Get variables associated through a many-to-many relationship table
     * @param {String} recordId - sys_id of the current record
     * @param {String} variableTable - Table containing variables
     * @param {String} m2mTable - M2M relationship table
     * @param {String} sourceField - Field in M2M table referencing the record
     * @param {String} variableField - Field in M2M table referencing the variable
     * @param {Array} fields - Fields to retrieve
     * @param {Number} maxRecords - Maximum records to retrieve
     * @returns {Array} Array of variable objects
     */
    function getM2MVariables(recordId, variableTable, m2mTable, sourceField, variableField, fields, maxRecords) {
        var variables = [];
        var variableIds = [];

        // First, get all variable IDs from the M2M table
        var m2mGr = new GlideRecord(m2mTable);
        if (!m2mGr.isValid()) {
            gs.warn('Invalid M2M table: ' + m2mTable);
            return variables;
        }

        if (!m2mGr.isValidField(sourceField) || !m2mGr.isValidField(variableField)) {
            gs.warn('Invalid M2M fields: ' + sourceField + ' or ' + variableField);
            return variables;
        }

        m2mGr.addQuery(sourceField, recordId);
        m2mGr.setLimit(maxRecords);
        m2mGr.query();

        while (m2mGr.next()) {
            var varId = m2mGr.getValue(variableField);
            if (varId) {
                variableIds.push(varId);
            }
        }

        // If no variable IDs found, return empty array
        if (variableIds.length === 0) {
            return variables;
        }

        // Now get the actual variable records
        var varGr = new GlideRecord(variableTable);
        if (!varGr.isValid()) {
            gs.warn('Invalid variable table: ' + variableTable);
            return variables;
        }

        varGr.addQuery('sys_id', 'IN', variableIds.join(','));
        varGr.query();

        while (varGr.next()) {
            var variable = buildVariableObject(varGr, fields);
            variables.push(variable);
        }

        return variables;
    }

    /**
     * Build a variable object from a GlideRecord
     * @param {GlideRecord} gr - GlideRecord containing variable data
     * @param {Array} fields - Fields to include in the object
     * @returns {Object} Variable object
     */
    function buildVariableObject(gr, fields) {
        var variable = {
            sys_id: gr.getValue('sys_id')
        };

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (gr.isValidField(field)) {
                var element = gr.getElement(field);
                variable[field] = {
                    value: gr.getValue(field),
                    displayValue: gr.getDisplayValue(field),
                    label: element.getLabel(),
                    type: element.getED().getInternalType()
                };
            }
        }

        return variable;
    }

})();
