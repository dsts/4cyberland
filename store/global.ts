export interface GlobalState {
  boards: GlobalStateBoard[]
}

export interface GlobalStateBoard {
  name: string
  id: string
}

export const state = (): GlobalState => ({
  // Hardcoded because at the moment there is no way to retrieve a list of
  // boards.
  boards: [
    {
      name: 'technloogy',
      id: 't'
    },
    {
      name: 'news',
      id: 'n'
    },
    {
      name: 'off-topic',
      id: 'o'
    }
  ]
})
