const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  name: state => state.user.username,
 // name: state => state.user.username,
  roles: state => state.user.roles,
  user_id:state=> state.user.user_id
}
export default getters
