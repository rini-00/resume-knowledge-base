import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  Edit3,
  Calendar,
  Tag,
  Target,
  Eye,
  FileText,
  Sparkles,
  Brain,
} from 'lucide-react';

// A user-interface component that helps structure resume achievements.
// The OpenAI API key has been replaced with a placeholder so that the
// consumer of this component can provide the key via environment variables
// or other secure means.

const ResumeLogger = () => {
  const [stage, setStage] = useState('reflection'); // reflection, input, processing, review, confirm, success
  const [userInput, setUserInput] = useState('');
  const [structuredData, setStructuredData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editField, setEditField] = useState(null);
  const [apiResponse, setApiResponse] = useState('');
  const [shouldProcess, setShouldProcess] = useState(false);

  const reflectionQuestions = [
    "What did you accomplish this week that you're proud of?",
    "Any updates worth logging from your recent work?",
    "What progress or breakthrough did you make recently?",
    "Want to capture any achievements from your current projects?",
    "What impactful work have you completed lately?",
  ];

  const currentQuestion =
    reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];

  const inferStructureFromInput = async (input) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Replace with a real key or environment variable when deploying.
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-5-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert at structuring professional achievements from casual descriptions. \n\nBased on the user's input, extract and infer the following structured data in JSON format:\n- title: A concise, professional title (max 80 chars)\n- description: Clean up the user's input while preserving meaning\n- tags: Array of relevant technical/domain tags (e.g., "Power Platform", "DevOps", "Leadership")\n- impact_level: One of ["Exploratory", "In Progress", "Confirmed", "Strategic", "Enterprise Scale"]\n- visibility: Array indicating audience (e.g., ["Internal"], ["C-Suite"], ["Leadership"], ["Public"])\n- resume_bullet: A compelling, outcome-focused bullet point with action + result\n\nGuidelines:\n- Impact levels: Exploratory (research/prototypes), In Progress (ongoing work), Confirmed (completed deliverables), Strategic (team/dept impact), Enterprise Scale (org-wide impact)\n- Tags should be specific technologies, methodologies, or domains mentioned\n- Resume bullets should start with strong action verbs and include quantifiable results when possible\n- Visibility should reflect the organizational level of impact/audience\n\nRespond ONLY with valid JSON.`,
            },
            {
              role: 'user',
              content: input,
            },
          ],
        }),
      });

      const data = await response.json();
      const structuredJson = JSON.parse(data.choices[0].message.content);

      return {
        date: new Date().toISOString().split('T')[0],
        ...structuredJson,
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback to basic parsing if API fails
      return {
        date: new Date().toISOString().split('T')[0],
        title:
          input.split('.')[0]?.trim().substring(0, 80) || 'Recent Achievement',
        description: input.trim(),
        tags: ['Achievement'],
        impact_level: 'In Progress',
        visibility: ['Internal'],
        resume_bullet: `Accomplished ${
          input.split('.')[0]?.toLowerCase() || 'recent work'
        }.`,
      };
    }
  };

  const generateResumeBullet = (description, tags, impactLevel) => {
    // Extract key action words and results
    const actionWords = [
      'built',
      'created',
      'developed',
      'implemented',
      'designed',
      'led',
      'managed',
      'optimized',
      'automated',
      'delivered',
      'launched',
      'engineered',
      'established',
    ];
    const lowerDesc = description.toLowerCase();

    let action = 'Developed';
    actionWords.forEach((word) => {
      if (lowerDesc.includes(word)) {
        action = word.charAt(0).toUpperCase() + word.slice(1);
      }
    });

    // Create outcome-focused bullet
    const mainTech = tags.slice(0, 2).join(' and ');
    const bullet = `${action} ${mainTech.toLowerCase()}-based solution that ${description
      .split('.')[0]
      .toLowerCase()
      .replace(
        /^(built|created|developed|implemented|designed|led|managed|optimized|automated|delivered|launched|engineered|established)\s*/i,
        ''
      )}.`;

    return bullet.length > 150 ? `${bullet.substring(0, 147)}...` : bullet;
  };

  const handleInputSubmit = () => {
    if (userInput.trim()) {
      setStage('processing');
      setShouldProcess(true);
    }
  };

  // Handle the actual API call in useEffect to ensure proper re-rendering
  useEffect(() => {
    const processInput = async () => {
      if (shouldProcess && stage === 'processing') {
        try {
          const structured = await inferStructureFromInput(userInput);
          setStructuredData(structured);
          setStage('review');
        } catch (error) {
          console.error('Error during inference:', error);
          setStage('input');
        } finally {
          setShouldProcess(false);
        }
      }
    };

    processInput();
  }, [shouldProcess, stage, userInput]);

  const handleFieldEdit = (field, value) => {
    if (field === 'tags' || field === 'visibility') {
      // Handle array fields
      const arrayValue =
        typeof value === 'string'
          ? value
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s)
          : value;
      setStructuredData((prev) => ({ ...prev, [field]: arrayValue }));
    } else {
      setStructuredData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const submitToAPI = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://rini-sandbox.site/log-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(structuredData),
      });

      const result = await response.json();
      setApiResponse(result.result || 'Entry submitted successfully!');
      setStage('success');
    } catch (error) {
      setApiResponse(`Error: ${error.message}`);
      setStage('success');
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setStage('reflection');
    setUserInput('');
    setStructuredData({});
    setEditField(null);
    setApiResponse('');
  };

  if (stage === 'reflection' || stage === 'input') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <Sparkles className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Resume Achievement Logger
          </h1>
          <p className="text-gray-600">
            Capture your accomplishments with intelligent structuring
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-3"></div>
            <p className="text-lg text-gray-700 font-medium">
              {currentQuestion}
            </p>
          </div>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Share your thoughts freely... I'll help structure this into a professional achievement record."
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />

          <button
            onClick={handleInputSubmit}
            disabled={stage === 'processing' || !userInput.trim()}
            className="mt-4 flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span>{stage === 'processing' ? 'Analyzing...' : 'Analyze with AI'}</span>
          </button>

          {/* Debug info */}
          <div className="mt-2 text-xs text-gray-500">Current stage: {stage}</div>
        </div>
      </div>
    );
  }

  if (stage === 'processing') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="text-center">
          <Brain className="w-8 h-8 text-indigo-600 mx-auto mb-3 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Analyzing your input...
          </h2>
          <p className="text-gray-600 mb-6">
            Using GPT-5 Mini to structure your achievement
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'review') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Review Your Achievement
          </h2>
          <p className="text-gray-600">
            Here's what I captured — feel free to confirm or make edits:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <label className="font-semibold text-gray-700">Title</label>
              </div>
              <button
                onClick={() =>
                  setEditField(editField === 'title' ? null : 'title')
                }
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {editField === 'title' ? (
              <input
                type="text"
                value={structuredData.title}
                onChange={(e) => handleFieldEdit('title', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500"
                onBlur={() => setEditField(null)}
                autoFocus
              />
            ) : (
              <p className="text-gray-800">{structuredData.title}</p>
            )}
          </div>

          {/* Date */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <label className="font-semibold text-gray-700">Date</label>
              </div>
              <button
                onClick={() => setEditField(editField === 'date' ? null : 'date')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {editField === 'date' ? (
              <input
                type="date"
                value={structuredData.date}
                onChange={(e) => handleFieldEdit('date', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500"
                onBlur={() => setEditField(null)}
                autoFocus
              />
            ) : (
              <p className="text-gray-800">{structuredData.date}</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <label className="font-semibold text-gray-700">Tags</label>
              </div>
              <button
                onClick={() => setEditField(editField === 'tags' ? null : 'tags')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {editField === 'tags' ? (
              <input
                type="text"
                value={structuredData.tags.join(', ')}
                onChange={(e) => handleFieldEdit('tags', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="Comma-separated tags"
                onBlur={() => setEditField(null)}
                autoFocus
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {structuredData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Impact Level */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <label className="font-semibold text-gray-700">Impact Level</label>
              </div>
              <button
                onClick={() =>
                  setEditField(editField === 'impact_level' ? null : 'impact_level')
                }
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {editField === 'impact_level' ? (
              <select
                value={structuredData.impact_level}
                onChange={(e) => handleFieldEdit('impact_level', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500"
                onBlur={() => setEditField(null)}
                autoFocus
              >
                <option value="Exploratory">Exploratory</option>
                <option value="In Progress">In Progress</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Strategic">Strategic</option>
                <option value="Enterprise Scale">Enterprise Scale</option>
              </select>
            ) : (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {structuredData.impact_level}
              </span>
            )}
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                <label className="font-semibold text-gray-700">Visibility</label>
              </div>
              <button
                onClick={() =>
                  setEditField(editField === 'visibility' ? null : 'visibility')
                }
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {editField === 'visibility' ? (
              <input
                type="text"
                value={structuredData.visibility.join(', ')}
                onChange={(e) => handleFieldEdit('visibility', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="Comma-separated audiences"
                onBlur={() => setEditField(null)}
                autoFocus
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {structuredData.visibility.map((audience, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-gray-700">Description</label>
            <button
              onClick={() =>
                setEditField(editField === 'description' ? null : 'description')
              }
              className="text-indigo-600 hover:text-indigo-800"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          {editField === 'description' ? (
            <textarea
              value={structuredData.description}
              onChange={(e) => handleFieldEdit('description', e.target.value)}
              className="w-full h-24 p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 resize-none"
              onBlur={() => setEditField(null)}
              autoFocus
            />
          ) : (
            <p className="text-gray-800">{structuredData.description}</p>
          )}
        </div>

        {/* Resume Bullet */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-gray-700">Resume Bullet</label>
            <button
              onClick={() =>
                setEditField(editField === 'resume_bullet' ? null : 'resume_bullet')
              }
              className="text-indigo-600 hover:text-indigo-800"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        {editField === 'resume_bullet' ? (
            <textarea
              value={structuredData.resume_bullet}
              onChange={(e) => handleFieldEdit('resume_bullet', e.target.value)}
              className="w-full h-16 p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 resize-none"
              onBlur={() => setEditField(null)}
              autoFocus
            />
          ) : (
            <p className="text-gray-800 italic">
              • {structuredData.resume_bullet}
            </p>
          )}
        </div>

        <div className="flex space-x-4 mt-6 justify-center">
          <button
            onClick={() => setStage('input')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Edit
          </button>
          <button
            onClick={submitToAPI}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Confirm & Submit'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Achievement Logged!
          </h2>

          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-2">API Response:</h3>
            <p className="text-gray-800 bg-gray-50 p-3 rounded text-sm font-mono">
              {apiResponse}
            </p>
          </div>

          <button
            onClick={resetForm}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Log Another Achievement
          </button>
        </div>
      </div>
    );
  }
};

export default ResumeLogger;

