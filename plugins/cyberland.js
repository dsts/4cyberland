import qs from 'qs';

export default (context, inject) => {
  function parse(response) {
    // I don't know what Nuxt.js and Axios are doing behind the scenes but
    // whatever it is it's breaking the instanceof operator. An array does not
    // seem to be an instance of Object.

    let type = Object.prototype.toString.call(response.data);

    if (type === '[object Array]'
        || type === '[object Object]'
        || type === '[object Number]') {
      return response.data;
    } else {
      throw new Error('Server response is unintelligible: ' + response.data);
    }
  }

  inject('cyberlandGet', async function (path, { query }) {
    let response = await this.$axios({
      method: 'GET',
      url: '/proxy' + path,
      params: query,
      timeout: 5 * 60 * 1000,
    });

    return parse(response);
  })

  inject('cyberlandPost', async function (path, { query, data }) {
    let response = await this.$axios({
      method: 'POST',
      url: '/proxy' + path,
      params: query,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify(data),
      timeout: 5 * 60 * 1000,
    });

    return parse(response);
  })
}
