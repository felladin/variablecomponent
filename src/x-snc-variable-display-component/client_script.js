/**
 * Client Controller for Variable Display Component
 */

(function(componentApi) {
    'use strict';

    var c = componentApi;

    /**
     * Initialize component
     */
    c.initialize = function() {
        // Get record context
        c.data.recordId = c.input.recordId || c.input.sysId || '';
        c.data.tableName = c.input.table || '';
        
        // Get configuration properties
        c.data.variableTable = c.properties.variableTable || 'item_option_new';
        c.data.relationshipType = c.properties.relationshipType || 'direct';
        c.data.m2mTable = c.properties.m2mTable || '';
        c.data.m2mSourceField = c.properties.m2mSourceField || 'parent';
        c.data.m2mVariableField = c.properties.m2mVariableField || 'variable';
        c.data.directAssociationField = c.properties.directAssociationField || '';
        c.data.displayFields = c.properties.displayFields || 'question_text,value,type';
        c.data.showLabels = c.properties.showLabels !== false;
        c.data.maxRecords = c.properties.maxRecords || 50;

        // Initialize state
        c.data.variables = [];
        c.data.loading = true;
        c.data.error = null;
        c.data.hasData = false;

        // Load variables
        loadVariables();
    };

    /**
     * Load variables from server
     */
    function loadVariables() {
        c.data.loading = true;
        c.data.error = null;

        // Prepare data provider input
        var input = {
            recordId: c.data.recordId,
            table: c.data.tableName,
            variableTable: c.data.variableTable,
            relationshipType: c.data.relationshipType,
            m2mTable: c.data.m2mTable,
            m2mSourceField: c.data.m2mSourceField,
            m2mVariableField: c.data.m2mVariableField,
            directAssociationField: c.data.directAssociationField,
            displayFields: c.data.displayFields,
            maxRecords: c.data.maxRecords
        };

        // Call data provider
        c.dataProvider.variableDataProvider(input).then(function(result) {
            c.data.loading = false;
            
            if (result.error) {
                c.data.error = result.error;
                c.data.hasData = false;
            } else {
                c.data.variables = processVariables(result.variables);
                c.data.hasData = result.hasData;
            }
        }).catch(function(error) {
            c.data.loading = false;
            c.data.error = 'Failed to load variables: ' + error.message;
            c.data.hasData = false;
        });
    }

    /**
     * Process variables for display
     * @param {Array} variables - Raw variable data from server
     * @returns {Array} Processed variables
     */
    function processVariables(variables) {
        var processed = [];
        var fieldsArray = c.data.displayFields.split(',').map(function(field) {
            return field.trim();
        });

        for (var i = 0; i < variables.length; i++) {
            var variable = variables[i];
            var processedVar = {
                sys_id: variable.sys_id,
                fields: []
            };

            for (var j = 0; j < fieldsArray.length; j++) {
                var fieldName = fieldsArray[j];
                if (variable[fieldName]) {
                    var field = variable[fieldName];
                    processedVar.fields.push({
                        name: fieldName,
                        label: field.label || fieldName,
                        value: field.displayValue || field.value || '',
                        type: field.type || 'string'
                    });
                }
            }

            processed.push(processedVar);
        }

        return processed;
    }

    /**
     * Refresh component data
     */
    c.refresh = function() {
        loadVariables();
    };

    /**
     * Handle property changes
     */
    c.onPropertyChange = function(property, oldValue, newValue) {
        if (property === 'variableTable' || 
            property === 'relationshipType' || 
            property === 'm2mTable' ||
            property === 'directAssociationField' ||
            property === 'displayFields' ||
            property === 'maxRecords') {
            // Update data model
            c.data[property] = newValue;
            // Reload variables
            loadVariables();
        } else if (property === 'showLabels') {
            c.data.showLabels = newValue;
        }
    };

})(this);
