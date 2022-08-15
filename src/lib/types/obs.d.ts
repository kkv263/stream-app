export interface ObsScenes {
  name: string;
}

export interface ObsInputs {
  [name: string]: { 
    volume: string;
    muted: boolean
  }
}