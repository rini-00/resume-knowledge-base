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
      'Exploratory': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Strategic': 'bg-purple-100 text-purple-800',
      'Enterprise Scale': 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (stage === 'reflection' || stage === 'input') {
    return (
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <div className="card-shadow bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="gradient-bg px-8 py-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Resume Achievement Logger</h1>
                <p className="text-white/90 text-sm">Capture your accomplishments with intelligent structuring</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-lg font-medium text-gray-800 leading-relaxed">
                    {currentQuestion}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Share your thoughts freely — I'll help structure this into a professional achievement record.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tell me about your recent accomplishment..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl input-focus resize-none text-gray-700 placeholder-gray-400"
                style={{ minHeight: '120px' }}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Stage: <span className="font-medium text-indigo-600">{stage}</span>
                </div>
                <button
                  onClick={handleInputSubmit}
                  disabled={stage === 'processing' || !userInput.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
    );
  }

  if (stage === 'processing') {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="card-shadow bg-white rounded-2xl p-12 text-center">
          <div className="mb-6">
            <div className="inline-flex p-4 bg-indigo-50 rounded-full">
              <Brain className="w-8 h-8 text-indigo-600 animate-pulse-slow" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Analyzing your achievement...
          </h2>
          <p className="text-gray-600 mb-8">
            Using GPT-4 to intelligently structure your accomplishment
          </p>
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'review') {
    return (
      <div className="w-full max-w-6xl mx-auto animate-slide-up">
        <div className="card-shadow bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Review Your Achievement</h2>
                <p className="text-white/90 text-sm">Confirm or edit the structured data below</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Title */}
              <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <label className="font-semibold text-gray-800">Title</label>
                  </div>
                  <button
                    onClick={() => setEditField(editField === 'title' ? null : 'title')}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {editField === 'title' ? (
                  <input
                    type="text"
                    value={structuredData.title}
                    onChange={(e) => handleFieldEdit('title', e.target.value)}
                    className="w-full p-3 border-2 border-indigo-200 rounded-lg input-focus"
                    onBlur={() => setEditField(null)}
                    autoFocus
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{structuredData.title}</p>
                )}
              </div>

              {/* Date */}
              <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <label className="font-semibold text-gray-800">Date</label>
                  </div>
                  <button
                    onClick={() => setEditField(editField === 'date' ? null : 'date')}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {editField === 'date' ? (
                  <input
                    type="date"
                    value={structuredData.date}
                    onChange={(e) => handleFieldEdit('date', e.target.value)}
                    className="w-full p-3 border-2 border-indigo-200 rounded-lg input-focus"
                    onBlur={() => setEditField(null)}
                    autoFocus
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{structuredData.date}</p>
                )}
              </div>

              {/* Tags */}
              <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-indigo-600" />
                    <label className="font-semibold text-gray-800">Tags</label>
                  </div>
                  <button
                    onClick={() => setEditField(editField === 'tags' ? null : 'tags')}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {editField === 'tags' ? (
                  <input
                    type="text"
                    value={structuredData.tags?.join(', ') || ''}
                    onChange={(e) => handleFieldEdit('tags', e.target.value)}
                    className="w-full p-3 border-2 border-indigo-200 rounded-lg input-focus"
                    placeholder="Comma-separated tags"
                    onBlur={() => setEditField(null)}
                    autoFocus
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {structuredData.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Impact Level */}
              <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <label className="font-semibold text-gray-800">Impact Level</label>
                  </div>
                  <button
                    onClick={() => setEditField(editField === 'impact_level' ? null : 'impact_level')}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {editField === 'impact_level' ? (
                  <select
                    value={structuredData.impact_level}
                    onChange={(e) => handleFieldEdit('impact_level', e.target.value)}
                    className="w-full p-3 border-2 border-indigo-200 rounded-lg input-focus"
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
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getImpactColor(structuredData.impact_level)}`}>
                    {structuredData.impact_level}
                  </span>
                )}
              </div>

              {/* Visibility */}
              <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    <label className="font-semibold text-gray-800">Visibility</label>
                  </div>
                  <button
                    onClick={() => setEditField(editField === 'visibility' ? null : 'visibility')}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                {editField === 'visibility' ? (
                  <input
                    type="text"
                    value={structuredData.visibility?.join(', ') || ''}
                    onChange={(e) => handleFieldEdit('visibility', e.target.value)}
                    className="w-full p-3 border-2 border-indigo-200 rounded-lg input-focus"
                    placeholder="Comma-separated audiences"
                    onBlur={() => setEditField(null)}
                    autoFocus
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {structuredData.visibility?.map((audience, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-800 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Description</span>
                </label>
                <button
                  onClick={() => setEditField(editField === 'description' ? null : 'description')}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              {editField === 'description' ? (
                <textarea
                  value={structuredData.description}
                  onChange={(e) => handleFieldEdit('description', e.target.value)}
                  className="w-full h-24 p-3 border-2 border-indigo-200 rounded-lg input-focus resize-none"
                  onBlur={() => setEditField(null)}
                  autoFocus
                />
              ) : (
                <p className="text-gray-800 leading-relaxed">{structuredData.description}</p>
              )}
            </div>

            {/* Resume Bullet */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-800 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <span>Resume Bullet Point</span>
                </label>
                <button
                  onClick={() => setEditField(editField === 'resume_bullet' ? null : 'resume_bullet')}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              {editField === 'resume_bullet' ? (
                <textarea
                  value={structuredData.resume_bullet}
                  onChange={(e) => handleFieldEdit('resume_bullet', e.target.value)}
                  className="w-full h-20 p-3 border-2 border-indigo-200 rounded-lg input-focus resize-none"
                  onBlur={() => setEditField(null)}
                  autoFocus
                />
              ) : (
                <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                  <p className="text-gray-800 font-medium leading-relaxed">
                    • {structuredData.resume_bullet}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStage('input')}
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Edit</span>
              </button>
              <button
                onClick={submitToAPI}
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Confirm & Submit'}</span>
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <div className="card-shadow bg-white rounded-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-white text-center">
            <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Achievement Logged Successfully!</h2>
            <p className="text-white/90">Your accomplishment has been structured and saved to your knowledge base.</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>API Response</span>
              </h3>
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-gray-800 font-mono text-sm leading-relaxed">
                  {apiResponse}
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={resetForm}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Log Another Achievement</span>
              </button>
              
              <p className="text-gray-600 text-sm mt-4">
                Ready to capture your next accomplishment?
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResumeLogger;