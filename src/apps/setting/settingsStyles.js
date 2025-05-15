import styled from 'styled-components';

export const SettingsContainer = styled.div`
  font-family: 'Segoe UI', system-ui, sans-serif;

  color: #ffffff;
  margin: 0 auto;
  padding: 20px;
  width: 500px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4CAF50;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #3e8e41;
  }
`;

export const SettingsSection = styled.div`

  border-radius: 8px;
  padding: 16px;
`;

export const SectionTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.5rem;
  color: #4CAF50;
`;

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ThemeOption = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;

  &:hover {
    transform: scale(1.05);
  }

  &.selected div:first-child {
    border: 2px solid #4CAF50;
  }
`;

export const ThemePreview = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid transparent;
  background-size: cover;
  background-position: center;
  background-color: #333;
  color: white;
`;

export const ThemeName = styled.div`
  font-weight: 500;
`;

export const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3e8e41;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

export const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
  }

  input {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #444;
    background-color: #2a2a2a;
    color: white;
  }
`;

export const ComingSoon = styled.span`
  color: #888;
  font-size: 0.8rem;
  margin-left: 10px;
`;

export const SoundOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SoundLabel = styled.div`
  font-weight: 500;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="radio"] {
    accent-color: #4CAF50;
  }
`;

export const ExportButton = styled(Button)`
  margin-top: 16px;
  background-color: #2196F3;

  &:hover {
    background-color: #0b7dda;
  }
`;

export const CustomThemePanel = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #444;
`;