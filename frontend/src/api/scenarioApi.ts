import { api } from './axios';

type scenario_data = {
  title?: string;
  description?: string
}

export type ScenarioPayload = {
  id: string;
  scenario_data: scenario_data;
  create_id?: string;
  create_date?: string;
  modify_id?: string;
  modify_date?: string;
};

// Fetch the list of scenarios
export const getScenarioList = async (): Promise<ScenarioPayload[]> => {
  const response = await api.get('/scenario');
  return response.data;
};

// Fetch the list of scenarios
export const getScenario = async (
  id: string,
): Promise<ScenarioPayload[]> => {
  const response = await api.get(`/scenario/${id}`);
  return response.data;
};

// Create a new scenario
export const createScenario = async (
    scenario_data: scenario_data,
    create_id: string,
  ) => {
  const response = await api.post('/scenario', {
    scenario_data,
    create_id,
  });
  return response.data;
};

// Update an existing scenario
export const updateScenario = async (
  id: string,
  scenario_data: scenario_data,
  modify_id: string
) => {
  const response = await api.put(`/scenario/${id}`, {
    scenario_data,
    modify_id,
  });
  return response.data;
};

// Delete a scenario
export const deleteScenario = async (id: string) => {
  const response = await api.delete(`/scenario/${id}`);
  return response.data;
};