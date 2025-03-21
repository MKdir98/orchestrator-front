import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getGroups = () => {
	return axios.get(`${API_BASE_URL}/groups`);
};

export const createGroup = (name, rootUser, description) => {
	return axios.post(`${API_BASE_URL}/groups`, {
		name,
		root_user: rootUser,
		description: description,
	});
};

export const getUsersByGroup = (groupId) => {
	return axios.get(`${API_BASE_URL}/groups/${groupId}/users`);
};

export const createUser = (name, parentUserId, groupId, vncPort) => {
	return axios.post(`${API_BASE_URL}/users`, {
		name,
		parent_user_id: parentUserId,
		group_id: groupId,
		vnc_port: vncPort,
	});
};

export const addTask = (description, userId) => {
	return axios.post(`${API_BASE_URL}/tasks`, { description, user_id: userId });
};

export const processTasks = (userId) => {
	return axios.post(`${API_BASE_URL}/users/${userId}/process_tasks`);
};
