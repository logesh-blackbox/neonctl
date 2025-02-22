module.exports = (req, res) => {
  // If the branch name matches our test branch, return 409 Conflict
  if (req.body.branch.name === 'test-branch') {
    res.status(409).json({
      code: 'branch_already_exists',
      message: 'Branch with name "test-branch" already exists'
    });
  } else {
    // For other branch names, return success response
    res.json({
      branch: {
        id: 'br-test-123456',
        name: req.body.branch.name,
        default: false,
        current_state: 'ready',
        created_at: new Date().toISOString(),
        parent_id: 'br-parent-123456'
      },
      endpoints: [{
        id: 'ep-test-123456',
        created_at: new Date().toISOString()
      }],
      connection_uris: [{
        connection_uri: 'postgres://user:pass@test-endpoint/dbname'
      }]
    });
  }
};
