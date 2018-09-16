const requests = (function() {
    const getHeaders = (additional = {}) => new Headers({
        'Content-Type': 'application/json',
        ...additional
    });
    const apiURL = 'http://localhost:8080/api';

    const uri = postfix => apiURL + postfix,
        jsonParse = data => data.json(),
        defSuccess = d => console.log('default log, define success method', d) || d,
        defError = e => e,
        makeString = userData => typeof userData === 'string' ? userData : JSON.stringify(userData),
        perform = (request, {success = defSuccess, error = defError}) =>
                request.then(jsonParse)
                    .then(success)
                    .catch(error);

    return {
        users: {
            getOne(id, handlers = {}) {
                return perform(fetch(uri(`/users/${id}`)), handlers);
            },
            getAll(handlers = {}) {
                return perform(fetch(uri(`/users`)), handlers);
            },
            delete(id, handlers = {}) {
                return perform(fetch(uri(`/users/delete/${id}`), {method: 'DELETE'}), handlers);
            },
            add(userData, handlers = {}) {
                return perform(fetch(uri('/users/add'), {
                    method: 'POST',
                    headers: getHeaders(),
                    body: makeString(userData)
                }), handlers);
            },
            login(userData, handlers = {}) {
                return perform(fetch(uri('/users/login'), {
                    method: 'POST',
                    headers: getHeaders(),
                    body: makeString(userData)
                }), handlers);
            },
            bet(userData, handlers = {}) {
                return perform(fetch(uri('/users/bet'), {
                    method: 'POST',
                    headers: getHeaders(),
                    body: makeString(userData)
                }), handlers);
            }
        },
        animals: {
            add(animalData, handlers = {}) {
                return perform(fetch(uri('/animals/add'), {
                    method: 'POST',
                    headers: getHeaders(),
                    body: makeString(animalData)
                }), handlers);
            },
            delete(id, handlers = {}) {
                return perform(fetch(uri('/animals/delete/'+id), {method: 'DELETE'}), handlers);
            },
            getAll(handlers = {}) {
                return perform(fetch(uri('/animals')), handlers);
            },
            getInProgress(handlers = {}) {
                return perform(fetch(uri('/animals/in-progress')), handlers);
            },
            buyInProgressAnimal(purchaser, handlers = {}) {
                return perform(fetch(uri('/animals/buy'), {
                    method: 'POST',
                    headers: getHeaders(),
                    body: makeString(purchaser)
                }), handlers);
            },
            getPurchased(handlers ={}) {
                return perform(fetch(uri('/animals/purchased')), handlers);
            }
        }
    }
})();

console.log(requests);