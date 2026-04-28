import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,        // virtual users
  duration: '10s' // test duration
};

export default function () {
  let res = http.get('http://localhost:8000/docs');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
