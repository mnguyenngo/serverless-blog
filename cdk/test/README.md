# Tests

The test suite primarily contains integration tests.

## Common Issues

### All tests seem to be failing because config seem to be missing

If tests are failing due to a DynamoDB error similar to the following:

```javascript
DynamoDB Error: {
    "message": "Missing region in config",
    "code": "ConfigError",
    "time": "2022-05-20T04:51:47.438Z"
}
```

make sure that you set all environment variables in the `.env` file.

```bash
export $(xargs <.env)
```

[Relevant Stack Overflow](https://stackoverflow.com/questions/31039948/configuring-region-in-node-js-aws-sdk)

## References

1. [Jest CLI Docs](https://jestjs.io/docs/cli)
