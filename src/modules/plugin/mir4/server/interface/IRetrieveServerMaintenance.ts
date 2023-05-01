/**
 * Represents the interface for the Server Maintenance
 * 
 * @version 1.0.0
 * @since 04/18/23
 * @author
 *  - Devitrax
 */
export interface ServerMaintenanceDateResponse {
    sdate: string
    edate: string
}

export interface MaintenanceDetails {
    startDate: MaintenanceDate
    endDate: MaintenanceDate
}

export interface MaintenanceDate {
    date: string
    notified: boolean
}

export interface ServerMaintenanceResponse {
    code: number
}