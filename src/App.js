import React, { useState } from 'react';

const PullRequestForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repository, setRepository] = useState('');
  const [sourceBranch, setSourceBranch] = useState('');
  const [targetBranches, setTargetBranches] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const authenticateUser = async () => {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    });
    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      setErrorMessage('Authentication failed');
    }
  };

  const createPullRequests = async () => {
    const targetBranchesArr = targetBranches.split(',');
    for (const targetBranch of targetBranchesArr) {
      const response = await fetch(`https://api.github.com/repos/${username}/${repository}/pulls`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `Merge ${sourceBranch} into ${targetBranch}`,
          head: sourceBranch,
          base: targetBranch
        })
      });
      if (!response.ok) {
        setErrorMessage(`Failed to create pull request for ${targetBranch}`);
        return;
      }
    }
    setErrorMessage('');
    alert('Pull requests created successfully');
  };

  return (
    <div>
      {!isAuthenticated &&
        <div>
          <input type="text" placeholder="GitHub username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="GitHub password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={authenticateUser}>Authenticate</button>
          <p>{errorMessage}</p>
        </div>
      }
      {isAuthenticated &&
        <div>
          <input type="text" placeholder="Repository name" value={repository} onChange={(e) => setRepository(e.target.value)} />
          <input type="text" placeholder="Source branch" value={sourceBranch} onChange={(e) => setSourceBranch(e.target.value)} />
          <input type="text" placeholder="Comma-separated target branches" value={targetBranches} onChange={(e) => setTargetBranches(e.target.value)} />
          <button onClick={createPullRequests}>Create Pull Requests</button>
          <p>{errorMessage}</p>
        </div>
      }
    </div>
  );
};

export default PullRequestForm;
