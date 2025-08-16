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
  ArrowRight,
  ArrowLeft,
  Zap,
} from 'lucide-react';

const ResumeLogger = () => {
  const [stage, setStage] = useState('reflection');
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
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
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

  const handleInputSubmit = () => {
    if (userInput.trim()) {
      setStage('processing');
      setShouldProcess(true);
    }
  };

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

  const getImpactColor = (level) => {
    const colors = {
      'Exploratory': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Progress': 'bg-amber-100 text-amber-800 border-amber-200',
      'Confirmed': 'bg-green-100 text-green-800 border-green-200',
      'Strategic': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Enterprise Scale': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[level] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  // Reflection/Input Stage
  if (stage === 'reflection' || stage === 'input') {
    return (
      <div className="w-full min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-indigo-600 px-6 py-8 sm:px-8">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 p-3 bg-white bg-opacity-20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Resume Achievement Logger</h1>
                  <p className="text-indigo-100 text-sm mt-1">Capture your accomplishments with intelligent structuring</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-3"></div>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-slate-800 leading-relaxed mb-2">
                        {currentQuestion}
                      </p>
                      <p className="text-sm text-slate-600">
                        Share your thoughts freely — I'll help structure this into a professional achievement record.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="achievement-input" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Achievement
                  </label>
                  <textarea
                    id="achievement-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Tell me about your recent accomplishment..."
                    className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-800 placeholder-slate-400 transition-all duration-200"
                    style={{ minHeight: '120px' }}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-slate-500 font-mono">
                    Stage: <span className="font-medium text-indigo-600">{stage}</span>
                  </div>
                  <button
                    onClick={handleInputSubmit}
                    disabled={stage === 'processing' || !userInput.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                  >
                    <Brain className="w-4 h-4" />
                    <span>{stage === 'processing' ? 'Analyzing...' : 'Analyze with AI'}</span>
                    {stage !== 'processing' && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Processing Stage
  if (stage === 'processing') {
    return (
      <div className="w-full min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex p-4 bg-indigo-50 rounded-2xl">
                <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Analyzing your achievement...
            </h2>
            <p className="text-slate-600 mb-8 font-mono text-sm">
              Using GPT-4 to intelligently structure your accomplishment
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review Stage
  if (stage === 'review') {
    return (
      <div className="w-full min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 px-6 py-8 sm:px-8">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 p-3 bg-white bg-opacity-20 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Review Your Achievement</h2>
                  <p className="text-green-100 text-sm mt-1">Confirm or edit the structured data below</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Title Field */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-slate-600" />
                      <label className="text-sm font-medium text-slate-800">Title</label>
                    </div>
                    <button
                      onClick={() => setEditField(editField === 'title' ? null : 'title')}
                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  {editField === 'title' ? (
                    <input
                      type="text"
                      value={structuredData.title}
                      onChange={(e) => handleFieldEdit('title', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      onBlur={() => setEditField(null)}
                      autoFocus
                    />
                  ) : (
                    <p className="text-slate-800 font-medium leading-relaxed">{structuredData.title}</p>
                  )}
                </div>

                {/* Date Field */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-slate-600" />
                      <label className="text-sm font-medium text-slate-800">Date</label>
                    </div>
                    <button
                      onClick={() => setEditField(editField === 'date' ? null : 'date')}
                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  {editField === 'date' ? (
                    <input
                      type="date"
                      value={structuredData.date}
                      onChange={(e) => handleFieldEdit('date', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      onBlur={() => setEditField(null)}
                      autoFocus
                    />
                  ) : (
                    <p className="text-slate-800 font-medium">{structuredData.date}</p>
                  )}
                </div>

                {/* Tags Field */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Tag className="w-5 h-5 text-slate-600" />
                      <label className="text-sm font-medium text-slate-800">Tags</label>
                    </div>
                    <button
                      onClick={() => setEditField(editField === 'tags' ? null : 'tags')}
                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  {editField === 'tags' ? (
                    <input
                      type="text"
                      value={structuredData.tags?.join(', ') || ''}
                      onChange={(e) => handleFieldEdit('tags', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Comma-separated tags"
                      onBlur={() => setEditField(null)}
                      autoFocus
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {structuredData.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Impact Level Field */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-slate-600" />
                      <label className="text-sm font-medium text-slate-800">Impact Level</label>
                    </div>
                    <button
                      onClick={() => setEditField(editField === 'impact_level' ? null : 'impact_level')}
                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  {editField === 'impact_level' ? (
                    <select
                      value={structuredData.impact_level}
                      onChange={(e) => handleFieldEdit('impact_level', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                    <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-medium border ${getImpactColor(structuredData.impact_level)}`}>
                      {structuredData.impact_level}
                    </span>
                  )}
                </div>

                {/* Visibility Field */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-slate-600" />
                      <label className="text-sm font-medium text-slate-800">Visibility</label>
                    </div>
                    <button
                      onClick={() => setEditField(editField === 'visibility' ? null : 'visibility')}
                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  {editField === 'visibility' ? (
                    <input
                      type="text"
                      value={structuredData.visibility?.join(', ') || ''}
                      onChange={(e) => handleFieldEdit('visibility', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Comma-separated audiences"
                      onBlur={() => setEditField(null)}
                      autoFocus
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {structuredData.visibility?.map((audience, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description Field */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <label className="text-sm font-medium text-slate-800">Description</label>
                  </div>
                  <button
                    onClick={() => setEditField(editField === 'description' ? null : 'description')}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {editField === 'description' ? (
                  <textarea
                    value={structuredData.description}
                    onChange={(e) => handleFieldEdit('description', e.target.value)}
                    className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                    onBlur={() => setEditField(null)}
                    autoFocus
                  />
                ) : (
                  <p className="text-slate-800 leading-relaxed">{structuredData.description}</p>
                )}
              </div>

              {/* Resume Bullet Field */}
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    <label className="text-sm font-medium text-slate-800">Resume Bullet Point</label>
                  </div>
                  <button
                    onClick={() => setEditField(editField === 'resume_bullet' ? null : 'resume_bullet')}
                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {editField === 'resume_bullet' ? (
                  <textarea
                    value={structuredData.resume_bullet}
                    onChange={(e) => handleFieldEdit('resume_bullet', e.target.value)}
                    className="w-full h-20 p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                    onBlur={() => setEditField(null)}
                    autoFocus
                  />
                ) : (
                  <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                    <p className="text-slate-800 font-medium leading-relaxed">
                      • {structuredData.resume_bullet}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button
                  onClick={() => setStage('input')}
                  className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Edit</span>
                </button>
                <button
                  onClick={submitToAPI}
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Confirm & Submit'}</span>
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success Stage
  if (stage === 'success') {
    return (
      <div className="w-full min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-600 px-6 py-12 sm:px-8 text-center">
              <div className="inline-flex p-4 bg-white bg-opacity-20 rounded-2xl mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Achievement Logged Successfully!</h2>
              <p className="text-green-100">Your accomplishment has been structured and saved to your knowledge base.</p>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h3 className="text-sm font-medium text-slate-800">API Response</h3>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-slate-800 font-mono text-sm leading-relaxed">
                    {apiResponse}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={resetForm}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Log Another Achievement</span>
                </button>
                
                <p className="text-slate-600 text-sm mt-6">
                  Ready to capture your next accomplishment?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResumeLogger;