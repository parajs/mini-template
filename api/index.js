
import http from '../utils/http'

export function findTopMemorialList(data) {
  return http.get('/wechat/memorial/findTopMemorialList', data)
}
