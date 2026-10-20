import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { getAll as getAllCategories } from "../categories/categories.service";

/**
 * Retrieve support tickets with optional query parameters.
 * Normal authenticated user: returns caller's tickets.
 * Administrator: returns all tickets (including guests).
 *
 * Supported params: page, limit, sort, search, status, category, communicationMethod, userId
 */
export const getAllTickets = async (params = {}) => {
  const cleanParams = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "" && val !== "all") {
      cleanParams[key] = val;
    }
  });

  const res = await api.get(ENDPOINTS.SUPPORT_TICKETS.GET_ALL, {
    params: cleanParams,
  });
  return res.data;
};

/**
 * Retrieve one support ticket by ID.
 * Allowed for ticket owner or administrator.
 */
export const getTicket = async (ticketId) => {
  const res = await api.get(ENDPOINTS.SUPPORT_TICKETS.GET_ONE(ticketId));
  return res.data;
};

/**
 * Create a new support ticket.
 * Authenticated user: sends user token via Authorization header, no guestContact.
 * Guest user: isGuest = true, skipAuth = true (no Authorization header), includes guestContact.
 */
export const createTicket = async (ticketData, isGuest = false) => {
  const config = isGuest ? { skipAuth: true } : {};
  const res = await api.post(
    ENDPOINTS.SUPPORT_TICKETS.CREATE,
    ticketData,
    config
  );
  return res.data;
};

/**
 * Update a support ticket.
 * Normal user: can update title, desc, category only while status is 'open' (cannot send status).
 * Administrator: can update title, desc, category, and status regardless of current status.
 */
export const updateTicket = async (ticketId, ticketData) => {
  const res = await api.put(
    ENDPOINTS.SUPPORT_TICKETS.UPDATE(ticketId),
    ticketData
  );
  return res.data;
};

/**
 * Delete a support ticket (administrator only).
 */
export const deleteTicket = async (ticketId) => {
  const res = await api.delete(ENDPOINTS.SUPPORT_TICKETS.DELETE(ticketId));
  return res.data;
};

/**
 * Retrieve support categories from /api/v1/categories?type=support
 */
export const getSupportCategories = async (lang = "EN") => {
  const res = await getAllCategories({ type: "support", lang });
  return res?.data || [];
};
